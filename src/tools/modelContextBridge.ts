import { 
  TopologyNodeData, 
  TopologyEdgeData, 
  PricingTier 
} from '../types/topology';
import { CLOUD_REGIONS, RESOURCE_SKUS, PROVIDER_EGRESS_RULES } from '../data/catalog';
import { evaluateTopology, generateCPQQuote } from '../engine/finopsEngine';
import { generateTerraformHCL } from '../engine/terraformGenerator';
import { CustomRateSheet, applyRateSheetToCatalog } from '../engine/rateCardParser';

export interface WebMCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
  execute: (input: any) => Promise<any> | any;
}

export interface ModelContext {
  registerTool: (tool: WebMCPTool) => void;
  getTools?: () => WebMCPTool[];
}

declare global {
  interface Window {
    modelContext?: ModelContext;
  }
  interface Document {
    modelContext?: ModelContext;
  }
  interface Navigator {
    modelContext?: ModelContext;
  }
}

export class WebMCPBridge {
  private nodes: Array<{ id: string; data: TopologyNodeData }> = [];
  private edges: Array<{ id: string; source: string; target: string; data?: TopologyEdgeData }> = [];
  private pricingTier: PricingTier = 'on_demand';
  private onTopologyUpdateCallback?: (nodes: any[], edges: any[], pricingTier: PricingTier) => void;
  private registeredTools: Map<string, WebMCPTool> = new Map();

  constructor() {
    this.initModelContext();
  }

  public updateState(
    nodes: Array<{ id: string; data: TopologyNodeData }>,
    edges: Array<{ id: string; source: string; target: string; data?: TopologyEdgeData }>,
    pricingTier: PricingTier = 'on_demand'
  ) {
    this.nodes = nodes;
    this.edges = edges;
    this.pricingTier = pricingTier;
  }

  public onTopologyUpdate(callback: (nodes: any[], edges: any[], pricingTier: PricingTier) => void) {
    this.onTopologyUpdateCallback = callback;
  }

  private initModelContext() {
    const registry = {
      registerTool: (tool: WebMCPTool) => {
        this.registeredTools.set(tool.name, tool);
      },
      getTools: () => Array.from(this.registeredTools.values()),
    };

    const bindModelContext = (target: any) => {
      if (!target) return;
      try {
        if (target.modelContext && typeof target.modelContext.registerTool === 'function') {
          return;
        }
        Object.defineProperty(target, 'modelContext', {
          value: registry,
          writable: true,
          configurable: true,
        });
      } catch {
        try {
          target.modelContext = registry;
        } catch {
          // Safely ignored for read-only environments
        }
      }
    };

    if (typeof window !== 'undefined') bindModelContext(window);
    if (typeof document !== 'undefined') bindModelContext(document);
    if (typeof navigator !== 'undefined') bindModelContext(navigator);

    this.registerAllTools();
  }

  private registerAllTools() {
    const register = (tool: WebMCPTool) => {
      this.registeredTools.set(tool.name, tool);
      if (typeof document !== 'undefined' && document.modelContext && typeof document.modelContext.registerTool === 'function') {
        try {
          document.modelContext.registerTool(tool);
        } catch {}
      }
      if (typeof window !== 'undefined' && window.modelContext && typeof window.modelContext.registerTool === 'function') {
        try {
          window.modelContext.registerTool(tool);
        } catch {}
      }
    };

    // Tool 1: list_cloud_regions_and_skus
    register({
      name: 'list_cloud_regions_and_skus',
      description: 'Lists all available cloud regions, compute instances, database engines, and egress rates across AWS, GCP, Azure, and Cloudflare, including allowed commitment and spot tiers.',
      inputSchema: {
        type: 'object',
        properties: {
          provider: {
            type: 'string',
            enum: ['all', 'aws', 'gcp', 'azure', 'cloudflare'],
            description: 'Filter by cloud provider.',
          },
          serviceType: {
            type: 'string',
            enum: ['all', 'compute', 'database', 'storage', 'cdn_edge'],
            description: 'Filter by service category.',
          },
        },
      },
      execute: async (input: { provider?: string; serviceType?: string }) => {
        const providerFilter = input?.provider || 'all';
        const serviceFilter = input?.serviceType || 'all';

        const filteredRegions = Object.values(CLOUD_REGIONS).filter(r => 
          providerFilter === 'all' || r.provider === providerFilter
        );

        const filteredSKUs = RESOURCE_SKUS.filter(s => {
          const matchProvider = providerFilter === 'all' || s.provider === providerFilter;
          const matchService = serviceFilter === 'all' || s.serviceType === serviceFilter;
          return matchProvider && matchService;
        });

        return {
          totalRegions: filteredRegions.length,
          regions: filteredRegions,
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
          updatedEdgeId: input.edgeId,
          newTransferGb: input.monthlyTransferGb,
          newEgressSpend: newSummary.egressSpend,
          totalMonthlySpend: newSummary.totalMonthlySpend,
          violations: newSummary.violations,
        };
      },
    });

    // Tool 4: validate_compliance_and_latency
    register({
      name: 'validate_compliance_and_latency',
      description: 'Performs a comprehensive audit of GDPR data residency rules, cross-border PII transfers, unencrypted connections, and 95th-percentile network latency.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      execute: async () => {
        const summary = evaluateTopology(this.nodes, this.edges, this.pricingTier);
        return {
          gdprCompliant: summary.violations.filter(v => v.category === 'GDPR_DATA_RESIDENCY').length === 0,
          totalViolations: summary.violations.length,
          violations: summary.violations,
          averageGlobalLatencyMs: summary.averageGlobalLatencyMs,
          p95LatencyMs: summary.p95LatencyMs,
          carbonKgMonthly: summary.totalCarbonKgPerMonth,
        };
      },
    });

    // Tool 5: optimize_cloud_architecture
    register({
      name: 'optimize_cloud_architecture',
      description: 'Automatically analyzes the infrastructure and applies FinOps cost-cutting, edge caching, Spot optimization for stateless compute, and GDPR compliance fixes.',
      inputSchema: {
        type: 'object',
        properties: {
          strategy: {
            type: 'string',
            enum: ['cost_cut_savings_plans', 'spot_stateless_fleet', 'zero_egress_edge_cache', 'fix_gdpr_compliance', 'all_optimizations'],
            description: 'Optimization strategy to apply.',
          },
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
          changesApplied.push('Switched eligible compute and database nodes to 3-Year Savings Plans (up to 55% discount).');
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

    // Tool 6: apply_topology_to_canvas
    register({
      name: 'apply_topology_to_canvas',
      description: 'Directly modifies the live interactive React Flow canvas by adding, removing, or updating nodes and connections.',
      inputSchema: {
        type: 'object',
        properties: {
          nodes: { type: 'array', description: 'List of nodes with data' },
          edges: { type: 'array', description: 'List of connection edges' },
          pricingTier: { type: 'string', enum: ['on_demand', 'savings_plan_1yr', 'savings_plan_3yr', 'spot'] },
        },
      },
      execute: async (input: { nodes?: any[]; edges?: any[]; pricingTier?: PricingTier }) => {
        const nextNodes = input.nodes || this.nodes;
        const nextEdges = input.edges || this.edges;
        const nextTier = input.pricingTier || this.pricingTier;

        if (this.onTopologyUpdateCallback) {
          this.onTopologyUpdateCallback(nextNodes, nextEdges, nextTier);
        }

        const summary = evaluateTopology(nextNodes, nextEdges, nextTier);
        return {
          success: true,
          nodeCount: nextNodes.length,
          edgeCount: nextEdges.length,
          totalMonthlySpend: summary.totalMonthlySpend,
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
        const rateSheet: CustomRateSheet = {
          version: input.version || '1.0',
          enterpriseName: input.enterpriseName || 'Custom Enterprise EDA',
          blanketDiscountPercent: input.blanketDiscountPercent || 0,
          customEgressRatePerGb: input.customEgressRatePerGb,
          skuOverrides: input.skuOverrides || [],
        };

        applyRateSheetToCatalog(RESOURCE_SKUS, rateSheet);
        const newSummary = evaluateTopology(this.nodes, this.edges, this.pricingTier);

        if (this.onTopologyUpdateCallback) {
          this.onTopologyUpdateCallback(this.nodes, this.edges, this.pricingTier);
        }

        return {
          success: true,
          appliedAgreement: rateSheet.enterpriseName,
          blanketDiscountPercent: rateSheet.blanketDiscountPercent,
          skuOverridesCount: rateSheet.skuOverrides?.length || 0,
          newTotalMonthlySpend: newSummary.totalMonthlySpend,
          monthlySavingsAchieved: newSummary.totalMonthlySavings,
        };
      },
    });

    // Tool 8: export_terraform_iac
    register({
      name: 'export_terraform_iac',
      description: 'Generates production-ready Terraform HCL infrastructure code and an Enterprise CPQ Quote for the active visual topology.',
      inputSchema: {
        type: 'object',
        properties: {
          clientName: { type: 'string', description: 'Client / enterprise name' },
          projectTitle: { type: 'string', description: 'Project title' },
        },
      },
      execute: async (input: { clientName?: string; projectTitle?: string }) => {
        const hcl = generateTerraformHCL(this.nodes, this.edges);
        const quote = generateCPQQuote(
          this.nodes, 
          this.edges, 
          input?.clientName || 'Enterprise Cloud Customer',
          input?.projectTitle || 'Global Multi-Region Architecture CPQ',
          this.pricingTier
        );

        return {
          terraformHCL: hcl,
          quoteSummary: quote,
        };
      },
    });
  }

  public getTool(name: string): WebMCPTool | undefined {
    return this.registeredTools.get(name);
  }

  public getAllTools(): WebMCPTool[] {
    return Array.from(this.registeredTools.values());
  }

  public async executeTool(name: string, input: any): Promise<any> {
    const tool = this.registeredTools.get(name);
    if (!tool) {
      throw new Error(`Tool '${name}' is not registered on WebMCP.`);
    }
    return await tool.execute(input);
  }
}

export const webMCPBridge = new WebMCPBridge();
