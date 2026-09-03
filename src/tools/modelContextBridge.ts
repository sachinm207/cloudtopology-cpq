import { 
  TopologyNodeData, 
  TopologyEdgeData, 
  PricingTier, 

  CloudProvider,
  ServiceType
} from '../types/topology';
import { CLOUD_REGIONS, RESOURCE_SKUS, PROVIDER_EGRESS_RULES } from '../data/catalog';
import { evaluateTopology, generateCPQQuote } from '../engine/finopsEngine';
import { generateTerraformHCL } from '../engine/terraformGenerator';
import { CustomRateSheet, applyRateSheetToCatalog } from '../engine/rateCardParser';

export interface WebMCPToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
  execute: (input: any) => Promise<any>;
}

export class WebMCPBridge {
  private nodes: Array<{ id: string; data: TopologyNodeData }> = [];
  private edges: Array<{ id: string; source: string; target: string; data?: TopologyEdgeData }> = [];
  private pricingTier: PricingTier = 'on_demand';
  private tools: Map<string, WebMCPToolDefinition> = new Map();
  private onTopologyUpdateCallback?: (
    nodes: Array<{ id: string; position?: { x: number; y: number }; data: TopologyNodeData }>, 
    edges: Array<{ id: string; source: string; target: string; data?: TopologyEdgeData }>,
    tier?: PricingTier
  ) => void;

  constructor() {
    this.registerTools();
    this.publishToWindow();
  }

  public updateState(
    nodes: Array<{ id: string; data: TopologyNodeData }>,
    edges: Array<{ id: string; source: string; target: string; data?: TopologyEdgeData }>,
    pricingTier: PricingTier
  ) {
    this.nodes = nodes;
    this.edges = edges;
    this.pricingTier = pricingTier;
  }

  public onTopologyUpdate(
    callback: (
      nodes: Array<{ id: string; position?: { x: number; y: number }; data: TopologyNodeData }>, 
      edges: Array<{ id: string; source: string; target: string; data?: TopologyEdgeData }>,
      tier?: PricingTier
    ) => void
  ) {
    this.onTopologyUpdateCallback = callback;
  }

  private registerTools() {
    const register = (tool: WebMCPToolDefinition) => {
      this.tools.set(tool.name, tool);
    };

    // Tool 1: list_cloud_regions_and_skus
    register({
      name: 'list_cloud_regions_and_skus',
      description: 'Lists all available cloud providers (AWS, GCP, Azure, Cloudflare), geographic datacenter regions, and real-world resource SKUs with allowed pricing tiers.',
      inputSchema: {
        type: 'object',
        properties: {
          provider: { 
            type: 'string', 
            enum: ['aws', 'gcp', 'azure', 'cloudflare'],
            description: 'Optional filter by cloud provider' 
          },
          serviceType: {
            type: 'string',
            enum: ['compute', 'database', 'storage', 'cdn_edge'],
            description: 'Optional filter by service type'
          }
        },
      },
      execute: async (input: { provider?: CloudProvider; serviceType?: ServiceType }) => {
        let filteredRegions = Object.values(CLOUD_REGIONS);
        let filteredSKUs = RESOURCE_SKUS;

        if (input?.provider) {
          filteredRegions = filteredRegions.filter(r => r.provider === input.provider);
          filteredSKUs = filteredSKUs.filter(s => s.provider === input.provider);
        }

        if (input?.serviceType) {
          filteredSKUs = filteredSKUs.filter(s => s.serviceType === input.serviceType);
        }

        return {
          totalRegions: filteredRegions.length,
          regions: filteredRegions.map(r => ({
            id: r.id,
            name: r.name,
            provider: r.provider,
            city: r.city,
            country: r.country,
            isEU: r.isEU,
            carbonIntensity: r.carbonIntensity,
          })),
          totalSKUs: filteredSKUs.length,
          skus: filteredSKUs.map(s => ({
            id: s.id,
            name: s.name,
            provider: s.provider,
            serviceType: s.serviceType,
            hourlyPrice: s.hourlyPrice,
            monthlyPrice: s.monthlyPrice,
            savingsPlan1YrDiscount: s.savingsPlan1YrDiscount,
            savingsPlan3YrDiscount: s.savingsPlan3YrDiscount,
            allowedPricingTiers: s.allowedPricingTiers,
          })),
          egressRules: PROVIDER_EGRESS_RULES,
        };
      },
    });

    // Tool 2: get_topology_summary
    register({
      name: 'get_topology_summary',
      description: 'Returns the current visual cloud infrastructure topology, monthly spend breakdown ($/mo), cross-region egress bills, latency metrics, and GDPR compliance status.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      execute: async () => {
        const summary = evaluateTopology(this.nodes, this.edges, this.pricingTier);
        return {
          nodeCount: this.nodes.length,
          edgeCount: this.edges.length,
          pricingTier: this.pricingTier,
          costSummary: summary,
          nodes: this.nodes.map(n => {
            const sku = RESOURCE_SKUS.find(s => s.id === n.data.skuId);
            return {
              id: n.id,
              label: n.data.label,
              provider: n.data.provider,
              region: n.data.regionId,
              serviceType: n.data.serviceType,
              skuId: n.data.skuId,
              instances: n.data.instances,
              isPII: n.data.isPII,
              pricingTier: n.data.pricingTier || this.pricingTier,
              allowedPricingTiers: sku?.allowedPricingTiers || ['on_demand', 'savings_plan_1yr', 'savings_plan_3yr', 'spot'],
            };
          }),
          edges: this.edges.map(e => ({
            id: e.id,
            source: e.source,
            target: e.target,
            monthlyTransferGb: e.data?.monthlyTransferGb || 1000,
            connectionType: e.data?.connectionType || 'internet',
            monthlyEgressCost: e.data?.monthlyEgressCost || 0,
            calculatedLatencyMs: e.data?.calculatedLatencyMs || 0,
          })),
        };
      },
    });

    // Tool 3: simulate_traffic_and_egress
    register({
      name: 'simulate_traffic_and_egress',
      description: 'Simulates monthly inter-region data transfer traffic (GB) and computes exact piecewise egress bills and optical latency impact.',
      inputSchema: {
        type: 'object',
        properties: {
          edgeId: { type: 'string', description: 'ID of the connection edge' },
          monthlyTransferGb: { type: 'number', description: 'Data transfer volume in GB/month' },
          connectionType: { 
            type: 'string', 
            enum: ['internet', 'vpc_peering', 'direct_connect', 'cloudflare_tunnel'],
            description: 'Network link type'
          },
        },
        required: ['edgeId', 'monthlyTransferGb'],
      },
      execute: async (input: { edgeId: string; monthlyTransferGb: number; connectionType?: any }) => {
        const edge = this.edges.find(e => e.id === input.edgeId);
        if (!edge) {
          throw new Error(`Edge with ID ${input.edgeId} not found in active topology.`);
        }

        const updatedEdges = this.edges.map(e => {
          if (e.id === input.edgeId) {
            return {
              ...e,
              data: {
                ...e.data,
                monthlyTransferGb: input.monthlyTransferGb,
                connectionType: input.connectionType || e.data?.connectionType || 'internet',
                monthlyEgressCost: 0,
                calculatedLatencyMs: 0,
              } as TopologyEdgeData,
            };
          }
          return e;
        });

        const newSummary = evaluateTopology(this.nodes, updatedEdges, this.pricingTier);
        if (this.onTopologyUpdateCallback) {
          this.onTopologyUpdateCallback(this.nodes, updatedEdges, this.pricingTier);
        }

        return {
          success: true,
          edgeId: input.edgeId,
          newTransferGb: input.monthlyTransferGb,
          newEgressSpend: newSummary.egressSpend,
          newTotalMonthlySpend: newSummary.totalMonthlySpend,
          p95LatencyMs: newSummary.p95LatencyMs,
        };
      },
    });

    // Tool 4: validate_compliance_and_latency
    register({
      name: 'validate_compliance_and_latency',
      description: 'Audits active topology for GDPR EU data residency compliance, cross-region egress cost spikes, unencrypted connections, and high fiber latency.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      execute: async () => {
        const summary = evaluateTopology(this.nodes, this.edges, this.pricingTier);
        return {
          compliant: summary.violations.length === 0,
          gdprCompliant: summary.violations.length === 0,
          totalViolations: summary.violations.length,
          violations: summary.violations,
          p95LatencyMs: summary.p95LatencyMs,
          totalCarbonKgPerMonth: summary.totalCarbonKgPerMonth,
        };
      },
    });

    // Tool 5: optimize_cloud_architecture
    register({
      name: 'optimize_cloud_architecture',
      description: 'Applies automated FinOps architectural optimizations such as converting eligible nodes to 3-year savings plans or Spot, shifting traffic to Cloudflare zero-egress routes, or resolving GDPR violations.',
      inputSchema: {
        type: 'object',
        properties: {
          strategy: {
            type: 'string',
            enum: ['cost_cut_savings_plans', 'spot_stateless_fleet', 'zero_egress_edge_cache', 'fix_gdpr_compliance', 'all_optimizations'],
            description: 'Optimization strategy to apply'
          }
        },
        required: ['strategy'],
      },
      execute: async (input: { strategy: string }) => {
        let updatedNodes = [...this.nodes];
        let updatedEdges = [...this.edges];
        let updatedPricingTier = this.pricingTier;
        const changesApplied: string[] = [];

        if (input.strategy === 'cost_cut_savings_plans' || input.strategy === 'all_optimizations') {
          updatedPricingTier = 'savings_plan_3yr';
          updatedNodes = updatedNodes.map(n => ({
            ...n,
            data: {
              ...n.data,
              pricingTier: 'savings_plan_3yr',
            },
          }));
          changesApplied.push('Upgraded global commitment tier to 3-Year Savings Plans (up to 55% discount).');
        }

        if (input.strategy === 'spot_stateless_fleet') {
          updatedNodes = updatedNodes.map(n => {
            if (n.data.serviceType === 'compute') {
              changesApplied.push(`Converted compute node (${n.data.label}) to Spot (~65% off).`);
              return {
                ...n,
                data: {
                  ...n.data,
                  pricingTier: 'spot',
                },
              };
            }
            return n;
          });
        }

        if (input.strategy === 'fix_gdpr_compliance' || input.strategy === 'all_optimizations') {
          updatedNodes = updatedNodes.map(n => {
            if (n.data.isPII && !CLOUD_REGIONS[n.data.regionId]?.isEU) {
              changesApplied.push(`Relocated PII database (${n.data.label}) to Frankfurt (aws-eu-central-1) for strict GDPR compliance.`);
              return {
                ...n,
                data: {
                  ...n.data,
                  regionId: 'aws-eu-central-1',
                },
              };
            }
            return n;
          });
        }

        if (input.strategy === 'zero_egress_edge_cache' || input.strategy === 'all_optimizations') {
          const hasCloudflare = updatedNodes.some(n => n.data.provider === 'cloudflare');
          if (!hasCloudflare) {
            const edgeNodeId = `cf-edge-${Date.now()}`;
            updatedNodes.push({
              id: edgeNodeId,
              data: {
                label: 'Cloudflare Global CDN & Edge Cache',
                regionId: 'cf-global-edge',
                provider: 'cloudflare',
                serviceType: 'cdn_edge',
                skuId: 'cf-workers-enterprise',
                instances: 1,
                isPII: false,
                pricingTier: 'on_demand',
                monthlyCost: 50.00,
              },
            });

            updatedEdges = updatedEdges.map(e => ({
              ...e,
              data: {
                ...e.data,
                connectionType: 'cloudflare_tunnel',
                monthlyTransferGb: e.data?.monthlyTransferGb || 1000,
                encrypted: true,
                monthlyEgressCost: 0,
                calculatedLatencyMs: 8.5,
              },
            }));

            changesApplied.push('Injected Cloudflare Global Edge CDN with zero-egress Bandwidth Alliance tunneling.');
          }
        }

        const newSummary = evaluateTopology(updatedNodes, updatedEdges, updatedPricingTier);
        if (this.onTopologyUpdateCallback) {
          this.onTopologyUpdateCallback(updatedNodes, updatedEdges, updatedPricingTier);
        }

        return {
          success: true,
          strategy: input.strategy,
          changesApplied,
          newTotalMonthlySpend: newSummary.totalMonthlySpend,
          monthlySavingsAchieved: newSummary.totalMonthlySavings,
          newViolationsCount: newSummary.violations.length,
        };
      },
    });

    // Tool 6: apply_topology_to_canvas (Universal Normalizer for Flat or Nested AI shapes)
    register({
      name: 'apply_topology_to_canvas',
      description: 'Directly modifies the live interactive React Flow canvas by adding, removing, or updating nodes and connections. Accepts both flat and nested node formats.',
      inputSchema: {
        type: 'object',
        properties: {
          nodes: { type: 'array', description: 'List of nodes (flat or nested React Flow)' },
          edges: { type: 'array', description: 'List of connection edges' },
          pricingTier: { type: 'string', enum: ['on_demand', 'savings_plan_1yr', 'savings_plan_3yr', 'spot'] },
        },
      },
      execute: async (input: { nodes?: any[]; edges?: any[]; pricingTier?: PricingTier }) => {
        const nextTier = input.pricingTier || this.pricingTier;
        
        // Auto-normalize nodes whether passed as nested {id, position, data} or flat {id, label, skuId, ...}
        const rawNodes = input.nodes || this.nodes;
        const normalizedNodes = rawNodes.map((n: any, idx: number) => {
          const id = n.id || `node-${idx}-${Date.now()}`;
          const pos = n.position || { 
            x: 100 + (idx % 3) * 280, 
            y: 80 + Math.floor(idx / 3) * 180 
          };
          
          const flatOrNestedData = n.data || n;
          const skuId = flatOrNestedData.skuId || 'aws-ec2-m6i-xlarge';
          const sku = RESOURCE_SKUS.find(s => s.id === skuId);
          const provider = flatOrNestedData.provider || sku?.provider || 'aws';
          const serviceType = flatOrNestedData.serviceType || sku?.serviceType || 'compute';
          const instances = flatOrNestedData.instances || 1;
          const regionId = flatOrNestedData.regionId || flatOrNestedData.region || 'aws-us-east-1';
          const label = flatOrNestedData.label || sku?.name || 'Cloud Resource';
          const isPII = !!flatOrNestedData.isPII;
          const allocatedStorageGb = flatOrNestedData.allocatedStorageGb || (serviceType === 'storage' ? 1000 : undefined);
          const nodeTier = flatOrNestedData.pricingTier || nextTier;
          
          let baseCost = sku?.monthlyPrice || flatOrNestedData.monthlyCost || 100;
          if (serviceType === 'storage' && allocatedStorageGb) {
            baseCost = (allocatedStorageGb / 1000) * baseCost;
          }
          const monthlyCost = baseCost * instances;

          return {
            id,
            position: pos,
            data: {
              label,
              regionId,
              provider,
              serviceType,
              skuId,
              instances,
              allocatedStorageGb,
              isPII,
              pricingTier: nodeTier,
              monthlyCost,
              isConnected: true,
            } as TopologyNodeData,
          };
        });

        // Auto-normalize edges
        const rawEdges = input.edges || this.edges;
        const normalizedEdges = rawEdges.map((e: any, idx: number) => {
          const source = e.source || (e.from ? e.from : '');
          const target = e.target || (e.to ? e.to : '');
          const id = e.id || `e-${source}-${target}-${idx}`;
          const edgeData = e.data || e;
          
          return {
            id,
            source,
            target,
            data: {
              monthlyTransferGb: edgeData.monthlyTransferGb || edgeData.transferGb || 1000,
              connectionType: edgeData.connectionType || 'internet',
              encrypted: edgeData.encrypted !== false,
              monthlyEgressCost: edgeData.monthlyEgressCost || 0,
              calculatedLatencyMs: edgeData.calculatedLatencyMs || 15.0,
            } as TopologyEdgeData,
          };
        });

        if (this.onTopologyUpdateCallback) {
          this.onTopologyUpdateCallback(normalizedNodes, normalizedEdges, nextTier);
        }

        const summary = evaluateTopology(normalizedNodes, normalizedEdges, nextTier);
        return {
          success: true,
          nodeCount: normalizedNodes.length,
          edgeCount: normalizedEdges.length,
          pricingTier: nextTier,
          totalMonthlySpend: summary.totalMonthlySpend,
          totalMonthlySavings: summary.totalMonthlySavings,
          egressSpend: summary.egressSpend,
          p95LatencyMs: summary.p95LatencyMs,
          violations: summary.violations,
        };
      },
    });

    // Tool 7: apply_enterprise_rate_sheet
    register({
      name: 'apply_enterprise_rate_sheet',
      description: 'Applies a custom Enterprise Discount Agreement (EDA), blanket discount percentage, or custom SKU rates to the active FinOps catalog.',
      inputSchema: {
        type: 'object',
        properties: {
          enterpriseName: { type: 'string', description: 'Enterprise agreement name' },
          blanketDiscountPercent: { type: 'number', description: 'Blanket corporate discount percentage (e.g. 14.5 for 14.5% off)' },
          customEgressRatePerGb: { type: 'number', description: 'Negotiated custom egress rate ($/GB)' },
          skuOverrides: {
            type: 'array',
            description: 'Custom pricing overrides per SKU ID',
          },
        },
      },
      execute: async (input: CustomRateSheet) => {
        applyRateSheetToCatalog(RESOURCE_SKUS, input);
        const newSummary = evaluateTopology(this.nodes, this.edges, this.pricingTier);

        return {
          success: true,
          enterpriseName: input.enterpriseName || 'Custom Corporate Agreement',
          blanketDiscountPercent: input.blanketDiscountPercent || 0,
          customEgressRatePerGb: input.customEgressRatePerGb,
          newTotalMonthlySpend: newSummary.totalMonthlySpend,
          totalMonthlySavings: newSummary.totalMonthlySavings,
        };
      },
    });

    // Tool 8: export_terraform_iac
    register({
      name: 'export_terraform_iac',
      description: 'Exports production-grade Terraform HCL 2.0 configuration code and formal CPQ Quote for the active architecture.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      execute: async () => {
        const hcl = generateTerraformHCL(this.nodes, this.edges);
        const quote = generateCPQQuote(
          this.nodes, 
          this.edges, 
          'Enterprise Cloud Customer', 
          'Automated WebMCP Architecture CPQ Quote', 
          this.pricingTier
        );

        return {
          terraformHCL: hcl,
          quoteSummary: {
            quoteId: quote.quoteId,
            totalMonthlySpend: quote.summary.totalMonthlySpend,
            totalMonthlySavings: quote.summary.totalMonthlySavings,
            egressBandwidthFee: quote.summary.egressSpend,
            annualContractValue: quote.summary.totalMonthlySpend * 12,
            threeYearTotalContractValue: quote.summary.totalMonthlySpend * 36,
          },
        };
      },
    });
  }

  public getTool(name: string): WebMCPToolDefinition | undefined {
    return this.tools.get(name);
  }

  public getAllTools(): WebMCPToolDefinition[] {
    return Array.from(this.tools.values());
  }

  public async executeTool(name: string, input: any): Promise<any> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`WebMCP Tool '${name}' not found.`);
    }
    return await tool.execute(input);
  }

  private publishToWindow() {
    if (typeof window !== 'undefined') {
      const modelContext = {
        tools: Array.from(this.tools.values()).map(t => ({
          name: t.name,
          description: t.description,
          parameters: t.inputSchema,
        })),
        callTool: async (name: string, args: any) => {
          return await this.executeTool(name, args);
        },
      };

      (window as any).modelContext = modelContext;
      (document as any).modelContext = modelContext;
    }
  }
}

export const webMCPBridge = new WebMCPBridge();
