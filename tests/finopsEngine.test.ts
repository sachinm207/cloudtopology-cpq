import { describe, it, expect } from 'vitest';
import { 
  calculateGeodesicDistanceKm, 
  calculateNetworkLatencyMs, 
  calculateEgressCost,
  evaluateTopology,
  generateCPQQuote
} from '../src/engine/finopsEngine';
import { generateTerraformHCL } from '../src/engine/terraformGenerator';
import { webMCPBridge } from '../src/tools/modelContextBridge';
import { ARCHITECTURE_PRESETS } from '../src/data/presets';

describe('FinOps Calculation Engine', () => {
  it('correctly calculates geodesic distance and fiber latency between US East and Frankfurt', () => {
    // US East (Ashburn: 39.0438, -77.4874) to Frankfurt (50.1109, 8.6821) is ~6,500 - 6,700 km
    const distanceKm = calculateGeodesicDistanceKm(39.0438, -77.4874, 50.1109, 8.6821);
    expect(distanceKm).toBeGreaterThan(6000);
    expect(distanceKm).toBeLessThan(7000);

    // Latency over transatlantic fiber should be between 70ms and 85ms
    const latency = calculateNetworkLatencyMs('aws-us-east-1', 'aws-eu-central-1', 'internet');
    expect(latency).toBeGreaterThan(70);
    expect(latency).toBeLessThan(90);

    // Intra-region latency should be sub-3ms
    const intraLatency = calculateNetworkLatencyMs('aws-us-east-1', 'aws-us-east-1', 'vpc_peering');
    expect(intraLatency).toBeLessThan(3.0);
  });

  it('calculates tiered egress bills and respects zero-egress Cloudflare routes', () => {
    // 5,000 GB over AWS Internet egress ($0.09/GB for first 10TB) -> 5,000 * 0.09 = $450
    const awsEgress = calculateEgressCost('aws-us-east-1', 'aws-eu-central-1', 5000, 'internet');
    expect(awsEgress).toBeCloseTo(440.78, 1);

    // Cloudflare source or tunnel has 100% ZERO egress fee
    const cfEgress = calculateEgressCost('cf-global-edge', 'aws-us-east-1', 5000, 'cloudflare_tunnel');
    expect(cfEgress).toBe(0);
  });

  it('detects GDPR violations when EU PII database connects to US non-EU node', () => {
    const preset = ARCHITECTURE_PRESETS[2]; // GDPR FinTech preset
    const summary = evaluateTopology(
      preset.nodes as any,
      preset.edges as any,
      'savings_plan_3yr'
    );

    expect(summary.violations.length).toBeGreaterThan(0);
    const gdprViolation = summary.violations.find(v => v.category === 'GDPR_DATA_RESIDENCY');
    expect(gdprViolation).toBeDefined();
    expect(gdprViolation?.severity).toBe('critical');
  });

  it('generates valid Terraform HCL containing providers and resources', () => {
    const preset = ARCHITECTURE_PRESETS[0];
    const hcl = generateTerraformHCL(preset.nodes as any, preset.edges as any);

    expect(hcl).toContain('terraform {');
    expect(hcl).toContain('aws = {');
    expect(hcl).toContain('resource "aws_instance"');
    expect(hcl).toContain('resource "aws_rds_cluster"');
  });

  it('registers all required WebMCP tools and executes queries successfully', async () => {
    const tools = webMCPBridge.getAllTools();
    expect(tools.length).toBeGreaterThanOrEqual(6);

    const toolNames = tools.map(t => t.name);
    expect(toolNames).toContain('list_cloud_regions_and_skus');
    expect(toolNames).toContain('get_topology_summary');
    expect(toolNames).toContain('simulate_traffic_and_egress');
    expect(toolNames).toContain('validate_compliance_and_latency');
    expect(toolNames).toContain('optimize_cloud_architecture');
    expect(toolNames).toContain('export_terraform_iac');

    // Execute list_cloud_regions_and_skus
    const skuResult = await webMCPBridge.executeTool('list_cloud_regions_and_skus', { provider: 'aws' });
    expect(skuResult.totalSKUs).toBeGreaterThan(0);
    expect(skuResult.regions.length).toBeGreaterThan(0);
  });
});
