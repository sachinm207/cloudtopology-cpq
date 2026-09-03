import React, { useState, useEffect, useMemo } from 'react';
import { 
  Layers, 
  PlusCircle, 
  AlertTriangle, 
  ShieldCheck, 
  ChevronRight,
  Sliders,
  Trash2,
  Tag,
  Lock,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  FolderOpen,

} from 'lucide-react';
import { TopologyNodeData, CloudProvider, ServiceType, ComplianceViolation, PricingTier } from '../types/topology';
import { CLOUD_REGIONS, RESOURCE_SKUS } from '../data/catalog';
import { ARCHITECTURE_PRESETS, ArchitecturePreset } from '../data/presets';
import { SavedArchitectureItem } from './SaveArchitectureModal';

interface SidebarProps {
  selectedNode: { id: string; data: TopologyNodeData } | null;
  onUpdateNode: (nodeId: string, updatedData: Partial<TopologyNodeData>) => void;
  onDeleteNode: (nodeId: string) => void;
  onAddNode: (provider: CloudProvider, serviceType: ServiceType, skuId: string, regionId: string) => void;
  onLoadPreset: (preset: ArchitecturePreset) => void;
  violations: ComplianceViolation[];
  savedArchitectures?: SavedArchitectureItem[];
  onLoadSavedArchitecture?: (item: SavedArchitectureItem) => void;
  onDeleteSavedArchitecture?: (id: string) => void;
  onOpenSaveModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedNode,
  onUpdateNode,
  onDeleteNode,
  onAddNode,
  onLoadPreset,
  violations,
  savedArchitectures = [],
  onLoadSavedArchitecture,
  onDeleteSavedArchitecture,
  onOpenSaveModal,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'palette' | 'node' | 'compliance'>('presets');
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider | 'all'>('aws');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Auto-expand and switch to inspect tab when a node is clicked on canvas
  useEffect(() => {
    if (selectedNode) {
      setActiveTab('node');
    }
  }, [selectedNode]);

  // Selected node SKU
  const selectedSku = selectedNode ? RESOURCE_SKUS.find(s => s.id === selectedNode.data.skuId) : null;
  const allowedTiers = selectedSku?.allowedPricingTiers || ['on_demand', 'savings_plan_1yr', 'savings_plan_3yr', 'spot'];

  // Filtered SKUs for Palette
  const filteredSkus = useMemo(() => {
    return RESOURCE_SKUS.filter((sku) => {
      const matchProvider = selectedProvider === 'all' || sku.provider === selectedProvider;
      
      let matchCategory = true;
      if (selectedCategory === 'compute') matchCategory = sku.serviceType === 'compute' && !sku.family.includes('GPU') && !sku.family.includes('Serverless');
      else if (selectedCategory === 'database') matchCategory = sku.serviceType === 'database';
      else if (selectedCategory === 'storage') matchCategory = sku.serviceType === 'storage';
      else if (selectedCategory === 'gpu_ai') matchCategory = sku.family.includes('GPU') || sku.family.includes('Accelerated') || sku.id.includes('workers-ai') || sku.id.includes('vectorize');
      else if (selectedCategory === 'serverless') matchCategory = sku.family.includes('Serverless') || sku.serviceType === 'cdn_edge';

      const matchSearch = searchQuery.trim() === '' || 
        sku.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sku.family.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sku.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sku.id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchProvider && matchCategory && matchSearch;
    });
  }, [selectedProvider, selectedCategory, searchQuery]);

  return (
    <aside 
      className={`border-r border-gray-800/80 bg-[#0B0F19]/95 backdrop-blur-md flex flex-col h-full z-10 select-none transition-all duration-300 ease-in-out relative ${
        isCollapsed ? 'w-14' : 'w-80'
      }`}
    >
      {/* COLLAPSED STATE: Slim Icon Rail */}
      {isCollapsed ? (
        <div className="flex flex-col items-center py-3 h-full justify-between">
          <div className="flex flex-col items-center gap-4 w-full">
            {/* Expand Toggle Button */}
            <button
              onClick={() => setIsCollapsed(false)}
              className="p-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-blue-400 hover:text-blue-300 transition-all cursor-pointer border border-gray-800 shadow-md"
              title="Expand Sidebar (Shift+E)"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>

            <div className="w-8 h-px bg-gray-800/80 my-1"></div>

            {/* Presets Icon */}
            <button
              onClick={() => { setActiveTab('presets'); setIsCollapsed(false); }}
              className={`p-2.5 rounded-xl transition-all cursor-pointer relative group ${
                activeTab === 'presets' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40' : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'
              }`}
              title="Architecture Presets & Saved Designs"
            >
              <Layers className="w-4 h-4" />
            </button>

            {/* Add Node Icon */}
            <button
              onClick={() => { setActiveTab('palette'); setIsCollapsed(false); }}
              className={`p-2.5 rounded-xl transition-all cursor-pointer relative group ${
                activeTab === 'palette' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40' : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'
              }`}
              title="Add Node Palette (50+ SKUs)"
            >
              <PlusCircle className="w-4 h-4" />
            </button>

            {/* Inspect Node Icon */}
            <button
              onClick={() => { setActiveTab('node'); setIsCollapsed(false); }}
              className={`p-2.5 rounded-xl transition-all cursor-pointer relative group ${
                activeTab === 'node' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40' : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'
              }`}
              title="Inspect Selected Node"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Compliance Audits Icon */}
            <button
              onClick={() => { setActiveTab('compliance'); setIsCollapsed(false); }}
              className={`p-2.5 rounded-xl transition-all cursor-pointer relative group ${
                activeTab === 'compliance' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40' : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'
              }`}
              title="Compliance & GDPR Audits"
            >
              <AlertTriangle className="w-4 h-4" />
              {violations.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-gray-950 animate-pulse"></span>
              )}
            </button>
          </div>

          {/* Quick Collapse Hint */}
          <button
            onClick={() => setIsCollapsed(false)}
            className="text-[9px] font-mono text-gray-500 hover:text-gray-300 writing-vertical py-2"
            title="Click to expand"
          >
            EXPAND
          </button>
        </div>
      ) : (
        /* EXPANDED STATE: Full Tabs & Content */
        <>
          {/* Header Strip with Collapse Button */}
          <div className="px-3 py-2 border-b border-gray-800/80 bg-gray-950/50 flex items-center justify-between text-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-gray-400">
              Navigation & Catalog
            </span>
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1 rounded-md bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-all cursor-pointer border border-gray-800"
              title="Collapse Sidebar for extra canvas space"
            >
              <PanelLeftClose className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="grid grid-cols-4 border-b border-gray-800 text-xs font-medium bg-gray-950/20">
            <button
              onClick={() => setActiveTab('presets')}
              className={`py-2.5 flex flex-col items-center gap-1 transition-colors border-b-2 cursor-pointer ${
                activeTab === 'presets'
                  ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="text-[11px]">Presets</span>
            </button>
            <button
              onClick={() => setActiveTab('palette')}
              className={`py-2.5 flex flex-col items-center gap-1 transition-colors border-b-2 cursor-pointer ${
                activeTab === 'palette'
                  ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="text-[11px]">Add Node</span>
            </button>
            <button
              onClick={() => setActiveTab('node')}
              className={`py-2.5 flex flex-col items-center gap-1 transition-colors border-b-2 cursor-pointer ${
                activeTab === 'node'
                  ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="text-[11px]">Inspect</span>
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`py-2.5 flex flex-col items-center gap-1 transition-colors border-b-2 cursor-pointer relative ${
                activeTab === 'compliance'
                  ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="text-[11px]">Audits</span>
              {violations.length > 0 && (
                <span className="absolute top-1.5 right-4 w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              )}
            </button>
          </div>

          {/* Tab 1: Architecture Presets & Saved Designs */}
          {activeTab === 'presets' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Quick Blank Canvas Button */}
              <button
                onClick={() => onLoadPreset(ARCHITECTURE_PRESETS[0])}
                className="w-full p-2.5 rounded-xl border border-blue-500/40 bg-blue-950/20 hover:bg-blue-900/30 text-blue-300 text-xs font-semibold flex items-center justify-between transition-all cursor-pointer shadow-sm group"
              >
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-blue-500/20 text-blue-300">✨</span>
                  <span>Start with Blank Canvas</span>
                </div>
                <span className="text-[10px] font-mono text-blue-400 group-hover:translate-x-0.5 transition-transform">Clear →</span>
              </button>

              {/* USER'S SAVED ARCHITECTURES SECTION */}
              {savedArchitectures.length > 0 && (
                <div className="pt-1 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="font-semibold uppercase tracking-wider text-[10px] text-emerald-400 flex items-center gap-1">
                      <FolderOpen className="w-3 h-3" /> My Saved Setups ({savedArchitectures.length})
                    </span>
                    {onOpenSaveModal && (
                      <button
                        onClick={onOpenSaveModal}
                        className="text-[10px] font-mono text-emerald-400 hover:underline cursor-pointer"
                      >
                        Manage
                      </button>
                    )}
                  </div>
                  {savedArchitectures.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-900/30 cursor-pointer transition-all group flex items-center justify-between gap-2"
                    >
                      <div 
                        onClick={() => onLoadSavedArchitecture && onLoadSavedArchitecture(item)}
                        className="min-w-0 flex-1"
                      >
                        <h4 className="font-bold text-xs text-emerald-200 group-hover:text-emerald-100 truncate">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400/80 mt-0.5">
                          <span>${item.summary.totalMonthlySpend.toLocaleString()}/mo</span>
                          <span>•</span>
                          <span>{item.summary.nodeCount} nodes</span>
                        </div>
                      </div>
                      {onDeleteSavedArchitecture && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSavedArchitecture(item.id);
                          }}
                          className="p-1 rounded text-gray-500 hover:text-rose-400 transition-colors"
                          title="Delete saved setup"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* STANDARD BUILT-IN TEMPLATES */}
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2 pt-1">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Architecture Templates</span>
                <span className="text-[10px] font-mono text-blue-400">1-Click Load</span>
              </div>
              {ARCHITECTURE_PRESETS.slice(1).map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => onLoadPreset(preset)}
                  className="p-3.5 rounded-xl border border-gray-800/80 bg-gray-900/50 hover:bg-gray-800/50 hover:border-blue-500/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-bold text-xs text-gray-200 group-hover:text-blue-400 transition-colors">
                      {preset.name}
                    </h3>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed mb-2.5">
                    {preset.description}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500">
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

          {/* Tab 2: Add Node Palette (Rich 50+ SKUs with Instant Search) */}
          {activeTab === 'palette' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search SKUs (e.g. H100, Aurora, ARM, S3, GPU)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-gray-900/90 border border-gray-800 rounded-lg text-xs text-gray-200 placeholder-gray-500 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Provider Selection */}
              <div>
                <div className="grid grid-cols-5 gap-1">
                  {(['all', 'aws', 'gcp', 'azure', 'cloudflare'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setSelectedProvider(p)}
                      className={`py-1 rounded text-[10px] font-mono font-bold uppercase transition-all cursor-pointer border ${
                        selectedProvider === p
                          ? 'bg-blue-600/30 border-blue-500 text-blue-300 shadow-sm'
                          : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:bg-gray-800'
                      }`}
                    >
                      {p === 'all' ? 'All' : p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'all', label: 'All SKUs' },
                  { id: 'compute', label: 'Compute' },
                  { id: 'gpu_ai', label: 'AI / GPU' },
                  { id: 'database', label: 'Database' },
                  { id: 'storage', label: 'Storage' },
                  { id: 'serverless', label: 'Serverless' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-all cursor-pointer border ${
                      selectedCategory === c.id
                        ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                        : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* SKU List with Detailed Specs & 1-Click Drop */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                  <span>Found {filteredSkus.length} SKUs</span>
                  <span className="text-emerald-400">Click to place on canvas</span>
                </div>

                {filteredSkus.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-xs">
                    No SKUs match "{searchQuery}". Try searching "GPU", "PostgreSQL", or "S3".
                  </div>
                ) : (
                  filteredSkus.map((sku) => {
                    const defaultRegion = Object.keys(CLOUD_REGIONS).find((r) => r.startsWith(sku.provider)) || 'aws-us-east-1';
                    const hasSpot = sku.allowedPricingTiers.includes('spot');
                    
                    return (
                      <div
                        key={sku.id}
                        onClick={() => onAddNode(sku.provider, sku.serviceType, sku.id, defaultRegion)}
                        className="p-2.5 rounded-xl border border-gray-800/80 bg-gray-900/40 hover:bg-gray-800/60 hover:border-blue-500/40 cursor-pointer transition-all group space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[9px] font-mono font-bold uppercase px-1 py-0.2 rounded border ${
                                sku.provider === 'aws' ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' :
                                sku.provider === 'gcp' ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' :
                                sku.provider === 'azure' ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20' :
                                'bg-orange-500/10 text-orange-300 border-orange-500/20'
                              }`}>
                                {sku.provider}
                              </span>
                              <h4 className="text-xs font-bold text-gray-200 group-hover:text-blue-400 truncate max-w-[150px]" title={sku.name}>
                                {sku.name}
                              </h4>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{sku.description}</p>
                          </div>

                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all flex-shrink-0">
                            + Add
                          </span>
                        </div>

                        {/* Specs & Pricing Line */}
                        <div className="flex items-center justify-between text-[10px] font-mono pt-1 border-t border-gray-800/50">
                          <div className="flex items-center gap-2 text-gray-300">
                            {sku.vCPU && <span>⚡ {sku.vCPU} vCPU</span>}
                            {sku.memoryGb && <span>• {sku.memoryGb} GB</span>}
                            {sku.storageGb && <span>💾 {sku.storageGb / 1000} TB</span>}
                            {!hasSpot && <span className="text-amber-400 text-[9px] flex items-center gap-0.5"><Lock className="w-2.5 h-2.5" /> No Spot</span>}
                          </div>

                          <div className="text-right">
                            <span className="font-bold text-emerald-400">${sku.monthlyPrice.toLocaleString()}/mo</span>
                            <span className="text-gray-500 text-[9px] block">(${sku.hourlyPrice.toFixed(4)}/hr)</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Inspect Selected Node */}
          {activeTab === 'node' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedNode ? (
                <>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                    <div>
                      <h3 className="font-bold text-sm text-gray-100">{selectedNode.data.label}</h3>
                      <p className="text-[10px] font-mono text-gray-400 uppercase">{selectedNode.data.provider} • {selectedNode.data.serviceType}</p>
                    </div>
                    <button
                      onClick={() => onDeleteNode(selectedNode.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all cursor-pointer"
                      title="Delete Node"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Node Label */}
                  <div>
                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                      Resource Name
                    </label>
                    <input
                      type="text"
                      value={selectedNode.data.label}
                      onChange={(e) => onUpdateNode(selectedNode.id, { label: e.target.value })}
                      className="w-full px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-xs text-gray-100 font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Region Selection */}
                  <div>
                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                      Geographic Region
                    </label>
                    <select
                      value={selectedNode.data.regionId}
                      onChange={(e) => onUpdateNode(selectedNode.id, { regionId: e.target.value })}
                      className="w-full px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-xs text-gray-100 font-mono focus:outline-none focus:border-blue-500"
                    >
                      {Object.values(CLOUD_REGIONS)
                        .filter((r) => r.provider === selectedNode.data.provider || selectedNode.data.provider === 'cloudflare')
                        .map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name} ({r.city}) {r.isEU ? '🇪🇺 EU' : ''}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Instance Count */}
                  {selectedNode.data.serviceType !== 'storage' && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                          Instance Scale
                        </label>
                        <span className="text-xs font-mono font-bold text-blue-400">
                          {selectedNode.data.instances || 1} {((selectedNode.data.instances || 1) > 1 ? 'nodes' : 'node')}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="32"
                        value={selectedNode.data.instances || 1}
                        onChange={(e) => onUpdateNode(selectedNode.id, { instances: parseInt(e.target.value) })}
                        className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>
                  )}

                  {/* Allocated Storage */}
                  {selectedNode.data.serviceType === 'storage' && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                          Allocated Storage
                        </label>
                        <span className="text-xs font-mono font-bold text-blue-400">
                          {((selectedNode.data.allocatedStorageGb || 1000) / 1000).toFixed(1)} TB
                        </span>
                      </div>
                      <input
                        type="range"
                        min="500"
                        max="50000"
                        step="500"
                        value={selectedNode.data.allocatedStorageGb || 1000}
                        onChange={(e) => onUpdateNode(selectedNode.id, { allocatedStorageGb: parseInt(e.target.value) })}
                        className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>
                  )}

                  {/* Per-Node Pricing Commitment Plan */}
                  <div>
                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3 text-emerald-400" />
                        Pricing Commitment Tier
                      </span>
                      {!allowedTiers.includes('spot') && (
                        <span className="text-[9px] text-amber-400 flex items-center gap-0.5 font-normal">
                          <Lock className="w-2.5 h-2.5" /> No Spot (Stateful)
                        </span>
                      )}
                    </label>
                    <select
                      value={selectedNode.data.pricingTier || 'on_demand'}
                      onChange={(e) => onUpdateNode(selectedNode.id, { pricingTier: e.target.value as PricingTier })}
                      className="w-full px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-xs text-gray-100 font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      {allowedTiers.includes('on_demand') && (
                        <option value="on_demand">On-Demand (0% Baseline)</option>
                      )}
                      {allowedTiers.includes('savings_plan_1yr') && (
                        <option value="savings_plan_1yr">1-Yr Savings Plan (~32% off)</option>
                      )}
                      {allowedTiers.includes('savings_plan_3yr') && (
                        <option value="savings_plan_3yr">3-Yr Savings Plan (~55% off)</option>
                      )}
                      {allowedTiers.includes('spot') ? (
                        <option value="spot">Spot Instances (~65% off)</option>
                      ) : (
                        <option disabled value="spot">🔒 Spot (Not allowed for Stateful)</option>
                      )}
                    </select>
                  </div>

                  {/* GDPR PII Toggle */}
                  <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-gray-200">Contains Customer PII</div>
                      <div className="text-[10px] text-gray-400">Triggers strict GDPR data residency audit</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!selectedNode.data.isPII}
                      onChange={(e) => onUpdateNode(selectedNode.id, { isPII: e.target.checked })}
                      className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center p-4">
                  <Sliders className="w-8 h-8 text-gray-600 mb-2" />
                  <p className="text-xs text-gray-400">Click any node on the canvas to inspect its configuration.</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Compliance & Audits */}
          {activeTab === 'compliance' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider text-[10px]">
                Active Architecture Audits
              </div>
              {violations.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-center space-y-2">
                  <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                  <div className="text-xs font-bold text-emerald-300">100% Policy Compliant</div>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    No GDPR data residency violations, high egress anomalies, or unencrypted link transfers detected.
                  </p>
                </div>
              ) : (
                violations.map((v, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-1.5"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>{v.category.replace(/_/g, ' ')}</span>
                    </div>
                    <p className="text-[11px] text-gray-300 leading-relaxed">{v.description}</p>
                    <div className="text-[10px] font-mono text-amber-400/80 bg-amber-950/40 p-2 rounded-lg border border-amber-500/20 mt-1">
                      💡 {v.recommendation}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </aside>
  );
};
