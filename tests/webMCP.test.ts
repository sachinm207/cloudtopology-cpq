import { describe, it, expect, beforeEach } from 'vitest';
import { webMCPBridge } from '../src/tools/modelContextBridge';
import { ARCHITECTURE_PRESETS } from '../src/data/presets';

describe('WebMCP Standard Compliance & Tool Registration Suite', () => {
  const preset = ARCHITECTURE_PRESETS[0];

  beforeEach(() => {
    webMCPBridge.updateState(
      preset.nodes.map(n => ({ id: n.id, data: n.data as any })),
      preset.edges.map(e => ({ id: e.id, source: e.source, target: e.target, data: e.data as any })),
      preset.pricingTier
    );
  });

  it('registers all 7 official WebMCP tools with JSON schemas', () => {
    const tools = webMCPBridge.getAllTools();
    expect(tools.length).toBe(7);

    const toolNames = tools.map(t => t.name);
    expect(toolNames).toContain('list_cloud_regions_and_skus');
    expect(toolNames).toContain('get_topology_summary');
    expect(toolNames).toContain('simulate_traffic_and_egress');
    expect(toolNames).toContain('validate_compliance_and_latency');
    expect(toolNames).toContain('optimize_cloud_architecture');
    expect(toolNames).toContain('apply_topology_to_canvas');
    expect(toolNames).toContain('export_terraform_iac');

    for (const tool of tools) {
      expect(tool.description).toBeTruthy();
      expect(tool.inputSchema.type).toBe('object');
      expect(typeof tool.execute).toBe('function');
    }
  });

  it('executes list_cloud_regions_and_skus tool properly', async () => {
    const result = await webMCPBridge.executeTool('list_cloud_regions_and_skus', { provider: 'aws' });
    expect(result.totalRegions).toBeGreaterThan(0);
    expect(result.totalSKUs).toBeGreaterThan(0);
    expect(result.skus.every((s: any) => s.provider === 'aws')).toBe(true);
  });

  it('executes get_topology_summary tool and returns accurate spend & latency', async () => {
    const result = await webMCPBridge.executeTool('get_topology_summary', {});
    expect(result.nodeCount).toBe(preset.nodes.length);
    expect(result.costSummary.totalMonthlySpend).toBeGreaterThan(0);
    expect(result.costSummary.averageGlobalLatencyMs).toBeGreaterThan(0);
  });

  it('executes simulate_traffic_and_egress tool and updates network cost', async () => {
    const edgeId = preset.edges[0].id;
    const result = await webMCPBridge.executeTool('simulate_traffic_and_egress', {
      edgeId,
      monthlyTransferGb: 15000,
    });
    expect(result.success).toBe(true);
    expect(result.newTransferGb).toBe(15000);
  });

  it('executes validate_compliance_and_latency tool for GDPR audits', async () => {
    const result = await webMCPBridge.executeTool('validate_compliance_and_latency', {});
    expect(typeof result.gdprCompliant).toBe('boolean');
    expect(result.p95LatencyMs).toBeGreaterThan(0);
  });

  it('executes optimize_cloud_architecture tool with 3-year commitment discount', async () => {
    const result = await webMCPBridge.executeTool('optimize_cloud_architecture', {
      strategy: 'cost_cut_savings_plans',
    });
    expect(result.success).toBe(true);
    expect(result.monthlySavingsAchieved).toBeGreaterThan(0);
  });

  it('executes export_terraform_iac tool and produces valid HCL 2.0 and CPQ Quote', async () => {
    const result = await webMCPBridge.executeTool('export_terraform_iac', {
      clientName: 'Global FinTech Enterprise',
      projectTitle: 'Multi-Region Sovereign Core',
    });
    expect(result.terraformHCL).toContain('terraform {');
    expect(result.terraformHCL).toContain('provider "aws"');
    expect(result.quoteSummary.quoteId).toMatch(/^CPQ-\d+/);
  });
});
