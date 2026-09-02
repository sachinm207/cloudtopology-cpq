import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Server, Database, HardDrive, Globe, Shield, Layers, Tag } from 'lucide-react';
import { TopologyNodeData } from '../types/topology';
import { CLOUD_REGIONS, RESOURCE_SKUS } from '../data/catalog';

const providerStyles: Record<string, { bg: string; border: string; badge: string; text: string }> = {
  aws: {
    bg: 'bg-[#1E170F]/90',
    border: 'border-amber-500/40 hover:border-amber-500',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    text: 'text-amber-400',
  },
  gcp: {
    bg: 'bg-[#0E1B2E]/90',
    border: 'border-blue-500/40 hover:border-blue-500',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    text: 'text-blue-400',
  },
  azure: {
    bg: 'bg-[#0D1C29]/90',
    border: 'border-cyan-500/40 hover:border-cyan-500',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    text: 'text-cyan-400',
  },
  cloudflare: {
    bg: 'bg-[#221609]/90',
    border: 'border-orange-500/40 hover:border-orange-500',
    badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
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
  savings_plan_1yr: { label: '1-Yr SP (~35% off)', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/30', text: 'text-blue-400' },
  savings_plan_3yr: { label: '3-Yr SP (~55% off)', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', text: 'text-emerald-400' },
  spot: { label: 'Spot (~65% off)', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/30', text: 'text-purple-400' },
};

export const CustomNode = memo((props: any) => {
  const data = (props?.data || {}) as TopologyNodeData;
  const selected = props?.selected;
  const provider = data.provider || 'aws';
  const providerStyle = providerStyles[provider] || providerStyles.aws;
  const ServiceIcon = serviceIcons[data.serviceType || 'compute'] || Server;
  const region = CLOUD_REGIONS[data.regionId || 'aws-us-east-1'];
  const sku = RESOURCE_SKUS.find((s) => s.id === data.skuId);

  // Dynamic cost calculation based on active pricing tier
  const tier = data.pricingTier || 'on_demand';
  const tierInfo = planLabels[tier] || planLabels.on_demand;

  let basePrice = sku?.monthlyPrice || 100;
  if (data.serviceType === 'storage' && data.allocatedStorageGb) {
    basePrice = (data.allocatedStorageGb / 1000) * basePrice;
  }
  const onDemandTotal = basePrice * (data.instances || 1);

  let discount = 0;
  if (tier === 'savings_plan_1yr') discount = sku?.savingsPlan1YrDiscount || 0.32;
  else if (tier === 'savings_plan_3yr') discount = sku?.savingsPlan3YrDiscount || 0.55;
  else if (tier === 'spot') discount = 0.65;

  const dynamicMonthlyCost = Math.round(onDemandTotal * (1 - discount));

  return (
    <div
      className={`relative rounded-xl border p-3.5 shadow-2xl backdrop-blur-md transition-all duration-200 min-w-[230px] max-w-[270px] ${
        providerStyle.bg
      } ${providerStyle.border} ${
        selected ? 'ring-2 ring-blue-400 scale-[1.02] shadow-blue-500/20' : ''
      }`}
    >
      {/* Connection Handles */}
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-blue-400 !border-2 !border-gray-900" />
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-blue-400 !border-2 !border-gray-900" />
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-blue-400 !border-2 !border-gray-900" />
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-blue-400 !border-2 !border-gray-900" />

      {/* Header: Provider & Service Type */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <div className={`p-1.5 rounded-lg bg-gray-900/60 border border-gray-700/50 ${providerStyle.text}`}>
            <ServiceIcon className="w-4 h-4" />
          </div>
          <span className={`text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full border ${providerStyle.badge}`}>
            {provider.toUpperCase()}
          </span>
        </div>
        
        {data.isPII && (
          <span className="flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40" title="Contains PII Data - Subject to GDPR">
            <Shield className="w-3 h-3 text-rose-400" />
            GDPR
          </span>
        )}
      </div>

      {/* Node Title */}
      <div className="font-semibold text-xs text-gray-100 truncate mb-1">
        {data.label || 'Node'}
      </div>

      {/* Region & SKU Info */}
      <div className="text-[11px] text-gray-400 mb-2 truncate">
        📍 {region?.name || data.regionId || 'Global'}
      </div>

      {/* Specs / Details */}
      <div className="bg-gray-950/60 rounded-lg p-2 border border-gray-800/80 mb-2 space-y-1">
        <div className="flex justify-between items-center text-[10px] text-gray-300">
          <span className="text-gray-400">SKU:</span>
          <span className="font-mono text-gray-200 truncate max-w-[120px]" title={sku?.name}>
            {sku?.name ? sku.name.split(' ')[1] || sku.name : data.skuId || 'Standard'}
          </span>
        </div>
        <div className="flex justify-between items-center text-[10px] text-gray-300">
          <span className="text-gray-400">Capacity:</span>
          <span className="font-mono font-medium text-gray-200">
            {data.serviceType === 'storage' 
              ? `${(data.allocatedStorageGb || 1000) / 1000} TB`
              : `${data.instances || 1} instance${(data.instances || 1) > 1 ? 's' : ''}`
            }
          </span>
        </div>
        <div className="flex justify-between items-center text-[10px] text-gray-300 pt-0.5 border-t border-gray-800/60">
          <span className="text-gray-400 flex items-center gap-1">
            <Tag className="w-2.5 h-2.5" /> Plan:
          </span>
          <span className={`font-mono text-[9px] px-1.5 py-0.2 rounded border font-semibold ${tierInfo.bg}`}>
            {tier === 'on_demand' ? 'On-Demand' : tier === 'savings_plan_1yr' ? '1-Yr SP' : tier === 'savings_plan_3yr' ? '3-Yr SP' : 'Spot'}
          </span>
        </div>
      </div>

      {/* Footer: Price Badge */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-800/60">
        <span className="text-[10px] text-gray-400 font-medium">Est. Monthly:</span>
        <div className="text-right">
          <span className="font-mono text-xs font-bold text-emerald-400">
            ${dynamicMonthlyCost.toLocaleString()}/mo
          </span>
          {discount > 0 && (
            <span className="text-[9px] text-gray-500 line-through block font-mono">
              ${Math.round(onDemandTotal)}/mo
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
