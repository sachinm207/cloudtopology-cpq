import React, { useState } from 'react';
import { 
  Layers, 
  PlusCircle, 
  AlertTriangle, 
  ShieldCheck, 
  ChevronRight,
  Sliders,
  Trash2
} from 'lucide-react';
import { TopologyNodeData, CloudProvider, ServiceType, ComplianceViolation } from '../types/topology';
import { CLOUD_REGIONS, RESOURCE_SKUS } from '../data/catalog';
import { ARCHITECTURE_PRESETS, ArchitecturePreset } from '../data/presets';

interface SidebarProps {
  selectedNode: { id: string; data: TopologyNodeData } | null;
  onUpdateNode: (nodeId: string, updatedData: Partial<TopologyNodeData>) => void;
  onDeleteNode: (nodeId: string) => void;
  onAddNode: (provider: CloudProvider, serviceType: ServiceType, skuId: string, regionId: string) => void;
  onLoadPreset: (preset: ArchitecturePreset) => void;
  violations: ComplianceViolation[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedNode,
  onUpdateNode,
  onDeleteNode,
  onAddNode,
  onLoadPreset,
  violations,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'palette' | 'node' | 'compliance'>('presets');
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider>('aws');
  const [selectedService, setSelectedService] = useState<ServiceType>('compute');

  return (
    <aside className="w-80 border-r border-gray-800/80 bg-[#0B0F19]/95 backdrop-blur-md flex flex-col h-[calc(100vh-4rem)] z-10 select-none">
      {/* Tab Navigation */}
      <div className="grid grid-cols-4 border-b border-gray-800 text-xs font-medium">
        <button
          onClick={() => setActiveTab('presets')}
          className={`py-3 flex flex-col items-center gap-1 transition-colors border-b-2 cursor-pointer ${
            activeTab === 'presets'
              ? 'border-blue-500 text-blue-400 bg-blue-500/5'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Presets</span>
        </button>
        <button
          onClick={() => setActiveTab('palette')}
          className={`py-3 flex flex-col items-center gap-1 transition-colors border-b-2 cursor-pointer ${
            activeTab === 'palette'
              ? 'border-blue-500 text-blue-400 bg-blue-500/5'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Node</span>
        </button>
        <button
          onClick={() => setActiveTab('node')}
          className={`py-3 flex flex-col items-center gap-1 transition-colors border-b-2 cursor-pointer relative ${
            activeTab === 'node'
              ? 'border-blue-500 text-blue-400 bg-blue-500/5'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Inspect</span>
          {selectedNode && (
            <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('compliance')}
          className={`py-3 flex flex-col items-center gap-1 transition-colors border-b-2 cursor-pointer relative ${
            activeTab === 'compliance'
              ? 'border-blue-500 text-blue-400 bg-blue-500/5'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Audits</span>
          {violations.length > 0 && (
            <span className="absolute top-1.5 right-2 px-1 rounded-full text-[9px] bg-rose-500 text-white font-mono font-bold">
              {violations.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* PRESETS TAB */}
        {activeTab === 'presets' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">Architecture Templates</h2>
              <span className="text-[10px] text-blue-400 font-mono">1-Click Load</span>
            </div>
            
            {ARCHITECTURE_PRESETS.map((preset) => (
              <div
                key={preset.id}
                onClick={() => onLoadPreset(preset)}
                className="group p-3 rounded-xl bg-gray-900/60 hover:bg-gray-800/80 border border-gray-800 hover:border-blue-500/50 transition-all cursor-pointer shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs font-bold text-gray-100 group-hover:text-blue-400 transition-colors">
                    {preset.name}
                  </h3>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[11px] text-gray-400 leading-tight mb-2">{preset.tagline}</p>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                  <span>{preset.nodes.length} nodes</span>
                  <span>•</span>
                  <span>{preset.edges.length} edges</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">{preset.pricingTier}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ADD NODE PALETTE */}
        {activeTab === 'palette' && (
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                1. Select Cloud Provider
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['aws', 'gcp', 'azure', 'cloudflare'] as CloudProvider[]).map((prov) => (
                  <button
                    key={prov}
                    onClick={() => setSelectedProvider(prov)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all cursor-pointer ${
                      selectedProvider === prov
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    {prov.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                2. Select Service Category
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['compute', 'database', 'storage', 'cdn_edge'] as ServiceType[]).map((serv) => (
                  <button
                    key={serv}
                    onClick={() => setSelectedService(serv)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border text-left capitalize transition-all cursor-pointer ${
                      selectedService === serv
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    {serv.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                3. Available Catalog SKUs
              </label>
              <div className="space-y-2">
                {RESOURCE_SKUS.filter(
                  (s) => s.provider === selectedProvider && s.serviceType === selectedService
                ).map((sku) => {
                  const defaultRegion = Object.keys(CLOUD_REGIONS).find(
                    (r) => CLOUD_REGIONS[r].provider === selectedProvider
                  ) || 'aws-us-east-1';

                  return (
                    <div
                      key={sku.id}
                      onClick={() => onAddNode(selectedProvider, selectedService, sku.id, defaultRegion)}
                      className="p-2.5 rounded-lg bg-gray-900/80 border border-gray-800 hover:border-emerald-500/50 transition-all cursor-pointer hover:bg-gray-800"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-gray-200">{sku.name}</span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          ${Math.round(sku.monthlyPrice)}/mo
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 line-clamp-2">{sku.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* NODE INSPECTOR */}
        {activeTab === 'node' && (
          <div>
            {selectedNode ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                  <div>
                    <h3 className="text-xs font-bold text-gray-100">{selectedNode.data.label}</h3>
                    <p className="text-[10px] font-mono text-gray-400">Node ID: {selectedNode.id}</p>
                  </div>
                  <button
                    onClick={() => onDeleteNode(selectedNode.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
                    title="Delete Node"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Node Label */}
                <div>
                  <label className="text-[11px] font-medium text-gray-400 block mb-1">Node Label</label>
                  <input
                    type="text"
                    value={selectedNode.data.label}
                    onChange={(e) => onUpdateNode(selectedNode.id, { label: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Region Selector */}
                <div>
                  <label className="text-[11px] font-medium text-gray-400 block mb-1">Cloud Region</label>
                  <select
                    value={selectedNode.data.regionId}
                    onChange={(e) => onUpdateNode(selectedNode.id, { regionId: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-100 font-mono focus:outline-none focus:border-blue-500"
                  >
                    {Object.values(CLOUD_REGIONS).map((reg) => (
                      <option key={reg.id} value={reg.id}>
                        {reg.name} {reg.isEU ? '🇪🇺 (EU GDPR)' : '🌐'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Instances Scale */}
                {selectedNode.data.serviceType === 'compute' && (
                  <div>
                    <div className="flex justify-between items-center text-[11px] font-medium text-gray-400 mb-1">
                      <span>Instances Count</span>
                      <span className="font-mono text-blue-400 font-bold">{selectedNode.data.instances}</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={32}
                      value={selectedNode.data.instances}
                      onChange={(e) => onUpdateNode(selectedNode.id, { instances: parseInt(e.target.value) })}
                      className="w-full accent-blue-500"
                    />
                  </div>
                )}

                {/* Storage Capacity Slider */}
                {selectedNode.data.serviceType === 'storage' && (
                  <div>
                    <div className="flex justify-between items-center text-[11px] font-medium text-gray-400 mb-1">
                      <span>Allocated Storage</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {((selectedNode.data.allocatedStorageGb || 1000) / 1000).toFixed(1)} TB
                      </span>
                    </div>
                    <input
                      type="range"
                      min={100}
                      max={100000}
                      step={500}
                      value={selectedNode.data.allocatedStorageGb || 1000}
                      onChange={(e) => onUpdateNode(selectedNode.id, { allocatedStorageGb: parseInt(e.target.value) })}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                )}

                {/* GDPR PII Switch */}
                <div className="p-3 rounded-lg bg-gray-900/60 border border-gray-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-gray-200 block">Contains PII / Customer Data</span>
                    <span className="text-[10px] text-gray-400">Enforces EU GDPR data residency check</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedNode.data.isPII}
                    onChange={(e) => onUpdateNode(selectedNode.id, { isPII: e.target.checked })}
                    className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Sliders className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-medium">No node selected.</p>
                <p className="text-[11px]">Click on any node in the topology canvas to inspect or adjust parameters.</p>
              </div>
            )}
          </div>
        )}

        {/* COMPLIANCE & AUDIT TAB */}
        {activeTab === 'compliance' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Compliance & FinOps Audits</h3>
              <span className="text-[10px] font-mono text-rose-400">{violations.length} Alerts</span>
            </div>

            {violations.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-center">
                <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                <h4 className="text-xs font-bold mb-1">Architecture 100% Compliant</h4>
                <p className="text-[11px] text-emerald-400/80">No GDPR data residency violations, egress spikes, or security issues detected.</p>
              </div>
            ) : (
              violations.map((v) => (
                <div
                  key={v.id}
                  className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                    v.severity === 'critical'
                      ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                      : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{v.title}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase ${
                      v.severity === 'critical' ? 'bg-rose-500/30 text-rose-300' : 'bg-amber-500/30 text-amber-300'
                    }`}>
                      {v.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-300 leading-snug">{v.description}</p>
                  <div className="pt-1 text-[10px] text-blue-300">
                    💡 <span className="font-semibold">Fix:</span> {v.recommendation}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
