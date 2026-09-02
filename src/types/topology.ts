export type CloudProvider = 'aws' | 'gcp' | 'azure' | 'cloudflare';

export type ServiceType = 
  | 'compute' 
  | 'database' 
  | 'storage' 
  | 'cdn_edge' 
  | 'gateway' 
  | 'queue';

export type PricingTier = 'on_demand' | 'savings_plan_1yr' | 'savings_plan_3yr' | 'spot';

export interface CloudRegion {
  id: string;
  name: string;
  provider: CloudProvider;
  continent: 'North America' | 'Europe' | 'Asia Pacific' | 'South America' | 'Global';
  country: string;
  city: string;
  lat: number;
  lng: number;
  isEU: boolean;
  carbonIntensity: number;
}

export interface ResourceSKU {
  id: string;
  name: string;
  provider: CloudProvider;
  serviceType: ServiceType;
  family: string;
  vCPU?: number;
  memoryGb?: number;
  storageGb?: number;
  hourlyPrice: number;
  monthlyPrice: number;
  savingsPlan1YrDiscount: number;
  savingsPlan3YrDiscount: number;
  description: string;
}

export interface EgressTier {
  maxTb: number;
  ratePerGb: number;
}

export interface ProviderEgressRules {
  internetTiers: EgressTier[];
  crossRegionPerGb: number;
  interZonePerGb: number;
  interContinentPerGb: number;
  zeroEgressAlliance: boolean;
}

export interface TopologyNodeData extends Record<string, unknown> {
  label: string;
  regionId: string;
  provider: CloudProvider;
  serviceType: ServiceType;
  skuId: string;
  instances: number;
  allocatedStorageGb?: number;
  iops?: number;
  cacheHitRatio?: number;
  isPII: boolean;
  pricingTier: PricingTier;
  monthlyCost: number;
  notes?: string;
}

export interface TopologyEdgeData extends Record<string, unknown> {
  monthlyTransferGb: number;
  connectionType: 'internet' | 'vpc_peering' | 'direct_connect' | 'cloudflare_tunnel';
  encrypted: boolean;
  monthlyEgressCost: number;
  calculatedLatencyMs: number;
}

export interface ComplianceViolation {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'GDPR_DATA_RESIDENCY' | 'EGRESS_SPIKE' | 'UNENCRYPTED_TRANSIT' | 'HIGH_LATENCY' | 'SINGLE_POINT_OF_FAILURE';
  title: string;
  description: string;
  sourceNodeId?: string;
  targetNodeId?: string;
  recommendation: string;
  potentialMonthlySavings?: number;
}

export interface TopologyCostSummary {
  totalMonthlySpend: number;
  computeSpend: number;
  databaseSpend: number;
  storageSpend: number;
  edgeSpend: number;
  egressSpend: number;
  onDemandBaseline: number;
  totalMonthlySavings: number;
  averageGlobalLatencyMs: number;
  p95LatencyMs: number;
  totalCarbonKgPerMonth: number;
  violations: ComplianceViolation[];
  activeDiscountPlan: PricingTier;
}

export interface CPQQuote {
  quoteId: string;
  generatedAt: string;
  clientName: string;
  projectTitle: string;
  architectureSummary: string;
  summary: TopologyCostSummary;
  lineItems: Array<{
    nodeId: string;
    name: string;
    provider: CloudProvider;
    region: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    monthlyTotal: number;
  }>;
  egressBreakdown: Array<{
    source: string;
    destination: string;
    transferTb: number;
    effectiveRatePerGb: number;
    monthlyCost: number;
  }>;
  recommendedOptimizations: Array<{
    action: string;
    monthlySavings: number;
    implementationEffort: 'Low' | 'Medium' | 'High';
  }>;
}
