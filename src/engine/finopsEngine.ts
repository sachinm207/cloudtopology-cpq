import { 
  TopologyNodeData, 
  TopologyEdgeData, 
  TopologyCostSummary, 
  ComplianceViolation, 
  PricingTier,
  CPQQuote
} from '../types/topology';
import { CLOUD_REGIONS, RESOURCE_SKUS, PROVIDER_EGRESS_RULES } from '../data/catalog';

/**
 * Calculates geodesic Great Circle distance (km) between two coordinates
 */
export function calculateGeodesicDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  if (lat1 === 0 && lon1 === 0) return 15; // Cloudflare Global Anycast average local edge distance
  if (lat2 === 0 && lon2 === 0) return 15;

  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates round-trip network latency (ms) based on optical fiber propagation + switching hops
 */
export function calculateNetworkLatencyMs(regionAId: string, regionBId: string, connectionType: string): number {
  if (regionAId === regionBId) {
    return connectionType === 'vpc_peering' ? 1.2 : 2.5; // Intra-region sub-3ms
  }

  const regionA = CLOUD_REGIONS[regionAId];
  const regionB = CLOUD_REGIONS[regionBId];

  if (!regionA || !regionB) return 45.0;

  if (regionA.id === 'cf-global-edge' || regionB.id === 'cf-global-edge') {
    return 8.5; // Cloudflare Anycast edge latency
  }

  const distanceKm = calculateGeodesicDistanceKm(regionA.lat, regionA.lng, regionB.lat, regionB.lng);
  
  // Optical fiber propagation speed in silica glass: ~200 km/ms
  // Round trip = 2 * distance / 200 = distance / 100
  const fiberPropagationMs = (2 * distanceKm) / 200;
  
  // Overhead penalty based on connection type
  let overheadMs = 8.0;
  if (connectionType === 'direct_connect') overheadMs = 3.0;
  else if (connectionType === 'vpc_peering') overheadMs = 5.0;
  else if (connectionType === 'internet') overheadMs = 15.0;
  else if (connectionType === 'cloudflare_tunnel') overheadMs = 6.0;

  return Math.round((fiberPropagationMs + overheadMs) * 10) / 10;
}

/**
 * Calculates monthly egress bandwidth bill based on tiered provider pricing
 */
export function calculateEgressCost(
  sourceRegionId: string,
  targetRegionId: string,
  monthlyTransferGb: number,
  connectionType: 'internet' | 'vpc_peering' | 'direct_connect' | 'cloudflare_tunnel'
): number {
  if (monthlyTransferGb <= 0) return 0;

  const sourceRegion = CLOUD_REGIONS[sourceRegionId];
  const targetRegion = CLOUD_REGIONS[targetRegionId];
  
  if (!sourceRegion) return 0;
  if (sourceRegion.provider === 'cloudflare') return 0; // 100% zero egress
  if (connectionType === 'cloudflare_tunnel') return 0; // Bandwidth alliance zero egress

  const rules = PROVIDER_EGRESS_RULES[sourceRegion.provider];
  if (!rules) return 0;

  // 1. Same region (Inter-Zone / VPC)
  if (sourceRegionId === targetRegionId) {
    return monthlyTransferGb * rules.interZonePerGb;
  }

  // 2. Cross-Region within same provider via internal backbone (VPC Peering / Direct Connect)
  if (targetRegion && sourceRegion.provider === targetRegion.provider && connectionType !== 'internet') {
    return monthlyTransferGb * rules.crossRegionPerGb;
  }

  // 3. Internet / Cross-Cloud Provider (Tiered public egress calculation)
  let remainingGb = monthlyTransferGb;
  let totalCost = 0;
  let previousMaxGb = 0;

  for (const tier of rules.internetTiers) {
    const tierCapacityGb = (tier.maxTb === Infinity ? Infinity : tier.maxTb * 1024) - previousMaxGb;
    const gbInThisTier = Math.min(remainingGb, tierCapacityGb);
    
    if (gbInThisTier > 0) {
      totalCost += gbInThisTier * tier.ratePerGb;
      remainingGb -= gbInThisTier;
      previousMaxGb += tierCapacityGb;
    }

    if (remainingGb <= 0) break;
  }

  return Math.round(totalCost * 100) / 100;
}

/**
 * Calculates complete topology cost, metrics, latency, and compliance
 */
export function evaluateTopology(
  nodes: Array<{ id: string; data: TopologyNodeData }>,
  edges: Array<{ id: string; source: string; target: string; data?: TopologyEdgeData }>,
  pricingTier: PricingTier = 'on_demand'
): TopologyCostSummary {
  let computeSpend = 0;
  let databaseSpend = 0;
  let storageSpend = 0;
  let edgeSpend = 0;
  let onDemandBaseline = 0;
  let totalCarbonKg = 0;

  const violations: ComplianceViolation[] = [];
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  // 1. Calculate Node Fixed / Compute / Storage Costs
  for (const node of nodes) {
    const data = node.data;
    const sku = RESOURCE_SKUS.find(s => s.id === data.skuId);
    const region = CLOUD_REGIONS[data.regionId];

    if (!sku) continue;

    let baseMonthlyUnit = sku.monthlyPrice;
    
    // Apply storage / instance scaling
    if (data.serviceType === 'storage' && data.allocatedStorageGb) {
      baseMonthlyUnit = (data.allocatedStorageGb / 1000) * baseMonthlyUnit;
    }
    const nodeOnDemandMonthly = baseMonthlyUnit * (data.instances || 1);
    onDemandBaseline += nodeOnDemandMonthly;

    // Apply active pricing discount plan
    let discount = 0;
    if (pricingTier === 'savings_plan_1yr') discount = sku.savingsPlan1YrDiscount;
    else if (pricingTier === 'savings_plan_3yr') discount = sku.savingsPlan3YrDiscount;
    else if (pricingTier === 'spot') discount = 0.65;

    const actualMonthly = nodeOnDemandMonthly * (1 - discount);

    if (data.serviceType === 'compute') computeSpend += actualMonthly;
    else if (data.serviceType === 'database') databaseSpend += actualMonthly;
    else if (data.serviceType === 'storage') storageSpend += actualMonthly;
    else if (data.serviceType === 'cdn_edge') edgeSpend += actualMonthly;

    // Carbon Footprint: kWh estimate ~ vCPU * 0.035 kW * 730 hrs
    const vCPU = sku.vCPU || 2;
    const estimatedMonthlyKwh = vCPU * 0.035 * 730 * (data.instances || 1);
    const regionCarbonIntensity = region?.carbonIntensity || 300;
    totalCarbonKg += (estimatedMonthlyKwh * regionCarbonIntensity) / 1000;
  }

  // 2. Calculate Egress Spend & Latency across Edges
  let egressSpend = 0;
  const latencies: number[] = [];

  for (const edge of edges) {
    const sourceNode = nodeMap.get(edge.source);
    const targetNode = nodeMap.get(edge.target);
    if (!sourceNode || !targetNode) continue;

    const transferGb = edge.data?.monthlyTransferGb || 1000;
    const connType = edge.data?.connectionType || 'internet';

    const cost = calculateEgressCost(
      sourceNode.data.regionId,
      targetNode.data.regionId,
      transferGb,
      connType
    );
    egressSpend += cost;

    const latency = calculateNetworkLatencyMs(
      sourceNode.data.regionId,
      targetNode.data.regionId,
      connType
    );
    latencies.push(latency);

    // Egress spike check
    if (cost > 1000) {
      violations.push({
        id: `egress-${edge.id}`,
        severity: 'warning',
        category: 'EGRESS_SPIKE',
        title: 'High Egress Bill Detected',
        description: `Edge between ${sourceNode.data.label} and ${targetNode.data.label} consumes ${transferGb.toLocaleString()} GB/mo, costing $${cost.toLocaleString()}/mo in transfer fees.`,
        sourceNodeId: sourceNode.id,
        targetNodeId: targetNode.id,
        recommendation: 'Attach a Cloudflare Global CDN Edge cache or enable VPC Peering/Cloudflare Tunnel to eliminate unbudgeted egress.',
        potentialMonthlySavings: Math.round(cost * 0.75),
      });
    }

    // GDPR & Data Residency Compliance Check
    const sourceRegion = CLOUD_REGIONS[sourceNode.data.regionId];
    const targetRegion = CLOUD_REGIONS[targetNode.data.regionId];

    if (sourceNode.data.isPII && sourceRegion?.isEU && !targetRegion?.isEU) {
      violations.push({
        id: `gdpr-${sourceNode.id}-${targetNode.id}`,
        severity: 'critical',
        category: 'GDPR_DATA_RESIDENCY',
        title: 'GDPR Cross-Border PII Transit Violation',
        description: `EU Database (${sourceNode.data.label} in ${sourceRegion.name}) contains PII data and is transmitting to non-EU node (${targetNode.data.label} in ${targetRegion?.name || 'US'}).`,
        sourceNodeId: sourceNode.id,
        targetNodeId: targetNode.id,
        recommendation: 'Deploy an EU-based Edge Tokenization Proxy or restrict database replication to EU sovereign regions (e.g. Frankfurt / Ireland).',
      });
    }

    // Unencrypted transit check
    if (connType === 'internet' && !edge.data?.encrypted && transferGb > 500) {
      violations.push({
        id: `sec-${edge.id}`,
        severity: 'warning',
        category: 'UNENCRYPTED_TRANSIT',
        title: 'Unencrypted Public Internet Transit',
        description: `High traffic volume (${transferGb.toLocaleString()} GB/mo) transmitted over unencrypted public internet between ${sourceNode.data.label} and ${targetNode.data.label}.`,
        sourceNodeId: sourceNode.id,
        targetNodeId: targetNode.id,
        recommendation: 'Switch connection to encrypted VPC Peering, IPsec VPN, or Cloudflare Zero Trust Tunnel.',
      });
    }
  }

  // Latency Metrics
  latencies.sort((a, b) => a - b);
  const avgLatency = latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 15.0;
  const p95Latency = latencies.length > 0 ? latencies[Math.floor(latencies.length * 0.95)] || latencies[latencies.length - 1] : 25.0;

  const totalMonthlySpend = Math.round((computeSpend + databaseSpend + storageSpend + edgeSpend + egressSpend) * 100) / 100;
  const baselineTotal = Math.round((onDemandBaseline + egressSpend) * 100) / 100;
  const totalMonthlySavings = Math.max(0, Math.round((baselineTotal - totalMonthlySpend) * 100) / 100);

  return {
    totalMonthlySpend,
    computeSpend: Math.round(computeSpend * 100) / 100,
    databaseSpend: Math.round(databaseSpend * 100) / 100,
    storageSpend: Math.round(storageSpend * 100) / 100,
    edgeSpend: Math.round(edgeSpend * 100) / 100,
    egressSpend: Math.round(egressSpend * 100) / 100,
    onDemandBaseline: baselineTotal,
    totalMonthlySavings,
    averageGlobalLatencyMs: Math.round(avgLatency * 10) / 10,
    p95LatencyMs: Math.round(p95Latency * 10) / 10,
    totalCarbonKgPerMonth: Math.round(totalCarbonKg),
    violations,
    activeDiscountPlan: pricingTier,
  };
}

/**
 * Generates an Enterprise FinOps CPQ Quote Document
 */
export function generateCPQQuote(
  nodes: Array<{ id: string; data: TopologyNodeData }>,
  edges: Array<{ id: string; source: string; target: string; data?: TopologyEdgeData }>,
  clientName: string = 'Enterprise Cloud Customer',
  projectTitle: string = 'Global Multi-Region Architecture CPQ',
  pricingTier: PricingTier = 'savings_plan_3yr'
): CPQQuote {
  const summary = evaluateTopology(nodes, edges, pricingTier);
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  const lineItems = nodes.map(node => {
    const sku = RESOURCE_SKUS.find(s => s.id === node.data.skuId);
    const region = CLOUD_REGIONS[node.data.regionId];
    const qty = node.data.instances || 1;
    let basePrice = sku?.monthlyPrice || 0;
    if (node.data.serviceType === 'storage' && node.data.allocatedStorageGb) {
      basePrice = (node.data.allocatedStorageGb / 1000) * basePrice;
    }
    
    let discount = 0;
    if (pricingTier === 'savings_plan_1yr') discount = sku?.savingsPlan1YrDiscount || 0;
    else if (pricingTier === 'savings_plan_3yr') discount = sku?.savingsPlan3YrDiscount || 0;
    else if (pricingTier === 'spot') discount = 0.65;

    const monthlyTotal = Math.round(basePrice * qty * (1 - discount) * 100) / 100;

    return {
      nodeId: node.id,
      name: node.data.label,
      provider: node.data.provider,
      region: region?.name || node.data.regionId,
      sku: sku?.name || node.data.skuId,
      quantity: qty,
      unitPrice: basePrice,
      monthlyTotal,
    };
  });

  const egressBreakdown = edges.map(edge => {
    const sourceNode = nodeMap.get(edge.source);
    const targetNode = nodeMap.get(edge.target);
    const transferGb = edge.data?.monthlyTransferGb || 1000;
    const cost = calculateEgressCost(
      sourceNode?.data.regionId || '',
      targetNode?.data.regionId || '',
      transferGb,
      edge.data?.connectionType || 'internet'
    );

    return {
      source: sourceNode?.data.label || edge.source,
      destination: targetNode?.data.label || edge.target,
      transferTb: Math.round((transferGb / 1024) * 100) / 100,
      effectiveRatePerGb: transferGb > 0 ? Math.round((cost / transferGb) * 1000) / 1000 : 0,
      monthlyCost: cost,
    };
  });

  const recommendedOptimizations: Array<{ action: string; monthlySavings: number; implementationEffort: 'Low' | 'Medium' | 'High' }> = [];

  if (pricingTier === 'on_demand') {
    const potential3YrSavings = summary.onDemandBaseline * 0.45;
    recommendedOptimizations.push({
      action: 'Convert steady-state Compute & Database instances to 3-Year Savings Plans / Reserved Instances.',
      monthlySavings: Math.round(potential3YrSavings),
      implementationEffort: 'Low',
    });
  }

  if (summary.egressSpend > 500) {
    recommendedOptimizations.push({
      action: 'Deploy Cloudflare R2 zero-egress object storage & Workers Edge caching to bypass AWS/GCP data transfer rates.',
      monthlySavings: Math.round(summary.egressSpend * 0.70),
      implementationEffort: 'Medium',
    });
  }

  return {
    quoteId: `CPQ-${Math.floor(100000 + Math.random() * 900000)}`,
    generatedAt: new Date().toISOString(),
    clientName,
    projectTitle,
    architectureSummary: `${nodes.length} nodes across ${new Set(nodes.map(n => n.data.regionId)).size} regions. Total monthly spend: $${summary.totalMonthlySpend.toLocaleString()}/mo with ${summary.violations.length} compliance alerts.`,
    summary,
    lineItems,
    egressBreakdown,
    recommendedOptimizations,
  };
}
