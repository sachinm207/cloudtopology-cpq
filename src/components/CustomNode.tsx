import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Server, Database, HardDrive, Globe, Shield, Layers, Sparkles, Link2Off } from 'lucide-react';
import { TopologyNodeData } from '../types/topology';
import { CLOUD_REGIONS, RESOURCE_SKUS } from '../data/catalog';

const providerStyles: Record<string, { bg: string; border: string; badge: string; text: string }> = {
  aws: {
    bg: 'bg-[#18130D]/95',
    border: 'border-amber-500/40 hover:border-amber-500',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    text: 'text-amber-400',
  },
  gcp: {
    bg: 'bg-[#0B1524]/95',
    border: 'border-blue-500/40 hover:border-blue-500',
    badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    text: 'text-blue-400',
  },
  azure: {
    bg: 'bg-[#0A1620]/95',
    border: 'border-cyan-500/40 hover:border-cyan-500',
    badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    text: 'text-cyan-400',
  },
  cloudflare: {
    bg: 'bg-[#1A1107]/95',
    border: 'border-orange-500/40 hover:border-orange-500',
    badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
    text: 'text-orange-400',
  },
};

const serviceIcons: Record<string, any> = {
  compute: Server,
  database: Database,
  storage: HardDrive,
  cdn_edge: Globe,
  gateway: Layers,
  queue: Layers,
};

const planLabels: Record<string, { label: string; bg: string; text: string }> = {
  on_demand: { label: 'On-Demand', bg: 'bg-gray-800 text-gray-300 border-gray-700', text: 'text-gray-300' },
  savings_plan_1yr: { label: '1-Yr SP', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/30', text: 'text-blue-400' },
  savings_plan_3yr: { label: '3-Yr SP', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', text: 'text-emerald-400' },
  spot: { label: 'Spot', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/30', text: 'text-purple-400' },
};

export const CustomNode = memo((props: any) => {
  const data = (props?.data || {}) as TopologyNodeData;
  const selected = props?.selected;
  const provider = data.provider || 'aws';
  const providerStyle = providerStyles[provider] || providerStyles.aws;
  const ServiceIcon = serviceIcons[data.serviceType || 'compute'] || Server;
  const region = CLOUD_REGIONS[data.regionId || 'aws-us-east-1'];
  const sku = RESOURCE_SKUS.find((s) => s.id === data.skuId);

  // Dynamic cost calculation with allowed tier enforcement
  const requestedTier = data.pricingTier || 'on_demand';
  const allowed = sku?.allowedPricingTiers || ['on_demand', 'savings_plan_1yr', 'savings_plan_3yr', 'spot'];
  const effectiveTier = allowed.includes(requestedTier) ? requestedTier : (allowed.includes('savings_plan_1yr') ? 'savings_plan_1yr' : 'on_demand');
  const tierInfo = planLabels[effectiveTier] || planLabels.on_demand;

  let basePrice = sku?.monthlyPrice || 100;
  if (data.serviceType === 'storage' && data.allocatedStorageGb) {
    basePrice = (data.allocatedStorageGb / 1000) * basePrice;
  }
  const onDemandTotal = basePrice * (data.instances || 1);

  let discount = 0;
  if (effectiveTier === 'savings_plan_1yr') discount = sku?.savingsPlan1YrDiscount || 0.32;
  else if (effectiveTier === 'savings_plan_3yr') discount = sku?.savingsPlan3YrDiscount || 0.55;
  else if (effectiveTier === 'spot') discount = 0.65;

  const dynamicMonthlyCost = Math.round(onDemandTotal * (1 - discount));

  // Capacity short display
  const capacityLabel = data.serviceType === 'storage'
    ? `${(data.allocatedStorageGb || 1000) / 1000} TB`
    : `${data.instances || 1}x`;

  const shortSku = sku?.name ? sku.name.split(' ')[1] || sku.name : data.skuId || 'Standard';
  const isUnconnected = data.isConnected === false;
  const isNew = !!data.isNew;

  return (
    <div
      className={`relative rounded-xl border p-2.5 shadow-xl backdrop-blur-md transition-all duration-300 min-w-[210px] max-w-[245px] ${
        providerStyle.bg
      } ${
        isNew 
          ? 'ring-4 ring-emerald-400/80 ring-offset-2 ring-offset-gray-950 shadow-2xl shadow-emerald-500/40 animate-pulse border-emerald-400' 
          : isUnconnected 
            ? 'border-dashed border-amber-400/70 shadow-amber-500/10' 
            : providerStyle.border
      } ${
        selected ? 'ring-2 ring-blue-400 scale-[1.02] shadow-blue-500/30' : ''
      }`}
    >
      {/* Newly Added Pulsing Tag Banner */}
      {isNew && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-emerald-500 text-gray-950 font-mono text-[9px] font-extrabold flex items-center gap-1 shadow-lg shadow-emerald-500/40 animate-bounce z-20 whitespace-nowrap">
          <Sparkles className="w-2.5 h-2.5" />
          JUST ADDED
        </div>
      )}

      {/* Unconnected Warning Tag */}
      {isUnconnected && !isNew && (
        <div className="absolute -top-2.5 right-2 px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-[8px] font-semibold flex items-center gap-0.5 shadow-sm z-20">
          <Link2Off className="w-2 h-2" />
          Unconnected
        </div>
      )}

      {/* Connection Handles */}
      <Handle type="target" position={Position.Top} className="!w-2.5 !h-2.5 !bg-blue-400 !border-2 !border-gray-900 hover:!scale-150 transition-transform" />
      <Handle type="source" position={Position.Bottom} className="!w-2.5 !h-2.5 !bg-blue-400 !border-2 !border-gray-900 hover:!scale-150 transition-transform" />
      <Handle type="target" position={Position.Left} className="!w-2.5 !h-2.5 !bg-blue-400 !border-2 !border-gray-900 hover:!scale-150 transition-transform" />
      <Handle type="source" position={Position.Right} className="!w-2.5 !h-2.5 !bg-blue-400 !border-2 !border-gray-900 hover:!scale-150 transition-transform" />

      {/* Row 1: Icon + Title + Plan & GDPR Badges */}
      <div className="flex items-center justify-between gap-1.5 mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className={`p-1 rounded bg-gray-900/80 border border-gray-700/50 ${providerStyle.text} flex-shrink-0`}>
            <ServiceIcon className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-xs text-gray-100 truncate">
            {data.label || 'Node'}
          </span>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {data.isPII && (
            <span className="text-[9px] font-mono font-semibold px-1 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-0.5">
              <Shield className="w-2.5 h-2.5" /> EU
            </span>
          )}
          <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded border ${tierInfo.bg}`}>
            {tierInfo.label}
          </span>
        </div>
      </div>

      {/* Row 2: Region & Spec Chip */}
      <div className="flex items-center justify-between text-[10px] text-gray-400 bg-gray-950/70 rounded-md px-2 py-1 mb-2 border border-gray-800/80 font-mono">
        <span className="truncate max-w-[110px]" title={region?.name || data.regionId}>
          📍 {region?.city || region?.name || data.regionId}
        </span>
        <span className="text-gray-300 font-semibold truncate max-w-[100px]" title={`${shortSku} (${capacityLabel})`}>
          {shortSku} ({capacityLabel})
        </span>
      </div>

      {/* Row 3: Compact Footer Price */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-800/60 text-[11px]">
        <span className="text-[10px] text-gray-400 font-mono">
          <span className={`font-bold uppercase ${providerStyle.text}`}>{provider}</span>
        </span>
        <div className="flex items-baseline gap-1.5">
          {discount > 0 && (
            <span className="text-[9px] text-gray-500 line-through font-mono">
              ${Math.round(onDemandTotal)}
            </span>
          )}
          <span className="font-mono text-xs font-bold text-emerald-400">
            ${dynamicMonthlyCost.toLocaleString()}<span className="text-[9px] text-gray-400 font-normal">/mo</span>
          </span>
        </div>
      </div>
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
