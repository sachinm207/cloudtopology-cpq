import { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';
import { Zap, Lock, Activity } from 'lucide-react';
import { TopologyEdgeData } from '../types/topology';

export const CustomEdge = memo((props: any) => {
  const {
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    style = {},
    markerEnd,
  } = props;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetPosition,
    targetX,
    targetY,
  });

  const edgeData = data as TopologyEdgeData | undefined;
  const transferGb = edgeData?.monthlyTransferGb || 1000;
  const cost = edgeData?.monthlyEgressCost || 0;
  const latency = edgeData?.calculatedLatencyMs || 15.0;
  const connType = edgeData?.connectionType || 'internet';
  const isHighCost = cost > 100;

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: Math.min(6, Math.max(2, (transferGb / 3000) * 2)),
          stroke: isHighCost ? '#EF4444' : connType === 'cloudflare_tunnel' ? '#F97316' : '#3B82F6',
          strokeDasharray: connType === 'internet' ? '5,5' : undefined,
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className={`group flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-mono shadow-lg backdrop-blur-md border transition-all cursor-pointer ${
            isHighCost 
              ? 'dark:bg-rose-950/90 bg-rose-50 dark:border-rose-500/50 border-rose-300 dark:text-rose-200 text-rose-800 hover:scale-105'
              : connType === 'cloudflare_tunnel'
              ? 'dark:bg-amber-950/90 bg-amber-50 dark:border-amber-500/50 border-amber-300 dark:text-amber-200 text-amber-800 hover:scale-105'
              : 'dark:bg-gray-900/90 bg-white/95 dark:border-gray-700/60 border-gray-300 dark:text-gray-200 text-gray-800 hover:scale-105'
          }`}
          title={`Throughput: ${transferGb.toLocaleString()} GB/mo | Egress Cost: $${cost}/mo | Round-trip Latency: ${latency}ms`}
        >
          {connType === 'cloudflare_tunnel' ? (
            <Zap className="w-3 h-3 text-amber-500 fill-amber-400/20" />
          ) : connType === 'vpc_peering' ? (
            <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Activity className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          )}

          <span className="font-semibold dark:text-gray-100 text-gray-900">
            {transferGb >= 1000 ? `${(transferGb / 1024).toFixed(1)} TB` : `${transferGb} GB`}
          </span>

          <span className="dark:text-gray-500 text-gray-400">|</span>

          <span className={cost > 0 ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-emerald-600 dark:text-emerald-400 font-medium'}>
            ${Math.round(cost)}/mo
          </span>

          <span className="dark:text-gray-500 text-gray-400">|</span>

          <span className="text-cyan-700 dark:text-cyan-300 font-medium">
            {latency}ms
          </span>
        </div>
      </EdgeLabelRenderer>
    </>
  );
});

CustomEdge.displayName = 'CustomEdge';
