import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { CustomNode } from './components/CustomNode';
import { CustomEdge } from './components/CustomEdge';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { QuoteModal } from './components/QuoteModal';
import { TerraformModal } from './components/TerraformModal';
import { RateUploadModal } from './components/RateUploadModal';
import { HowToUseModal } from './components/HowToUseModal';
import { WebMCPGuideModal } from './components/WebMCPGuideModal';
import { SaveArchitectureModal, SavedArchitectureItem } from './components/SaveArchitectureModal';

import { TopologyNodeData, TopologyEdgeData, PricingTier, CloudProvider, ServiceType } from './types/topology';
import { ARCHITECTURE_PRESETS, ArchitecturePreset } from './data/presets';
import { evaluateTopology, generateCPQQuote } from './engine/finopsEngine';
import { generateTerraformHCL } from './engine/terraformGenerator';
import { webMCPBridge } from './tools/modelContextBridge';
import { RESOURCE_SKUS } from './data/catalog';
import { CustomRateSheet, applyRateSheetToCatalog } from './engine/rateCardParser';
import { Sparkles, PlusCircle, Layers, Save } from 'lucide-react';

const nodeTypes = {
  customNode: CustomNode,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

const STORAGE_KEY_ACTIVE = 'cloudtopology_active_state_v2';
const STORAGE_KEY_SAVED = 'cloudtopology_saved_projects_v2';
const STORAGE_KEY_THEME = 'cloudtopology_theme_v1';

export function App() {
  const initialPreset = ARCHITECTURE_PRESETS[1] || ARCHITECTURE_PRESETS[0];

  // Theme state: light by default
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    } catch {}
    return 'light';
  });

  // Sync theme class with document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch {}
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Try loading active state from LocalStorage on mount
  const getInitialState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges) && parsed.nodes.length > 0) {
          const allValid = parsed.nodes.every(
            (n: any) => n && typeof n.id === 'string' && n.data && typeof n.data === 'object' && n.data.skuId
          );
          if (allValid) {
            return {
              nodes: parsed.nodes.map((n: any, idx: number) => ({
                ...n,
                type: 'customNode',
                position: (n.position && typeof n.position.x === 'number' && typeof n.position.y === 'number')
                  ? n.position
                  : { x: 100 + (idx % 3) * 280, y: 80 + Math.floor(idx / 3) * 180 },
                data: {
                  ...n.data,
                  isConnected: true,
                },
              })),
              edges: parsed.edges.map((e: any) => ({
                ...e,
                type: 'customEdge',
              })),
              pricingTier: parsed.pricingTier || 'savings_plan_1yr',
            };
          }
        }
      }
    } catch (e) {
      console.warn('Could not read cached topology state:', e);
    }
    return {
      nodes: initialPreset.nodes.map((n, idx) => ({
        ...n,
        type: 'customNode',
        position: (n.position && typeof n.position.x === 'number' && typeof n.position.y === 'number')
          ? n.position
          : { x: 100 + (idx % 3) * 280, y: 80 + Math.floor(idx / 3) * 180 },
        data: {
          ...n.data,
          pricingTier: initialPreset.pricingTier,
          isConnected: true,
        },
      })),
      edges: initialPreset.edges.map((e) => ({
        ...e,
        type: 'customEdge',
      })),
      pricingTier: initialPreset.pricingTier || 'savings_plan_1yr',
    };
  };

  const initial = useMemo(() => getInitialState(), []);

  const [nodes, setNodes, onNodesChange] = useNodesState<any>(initial.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>(initial.edges);
  const [pricingTier, setPricingTier] = useState<PricingTier>(initial.pricingTier);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Saved library state
  const [savedArchitectures, setSavedArchitectures] = useState<SavedArchitectureItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  // Modals state
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isTerraformOpen, setIsTerraformOpen] = useState(false);
  const [isRateUploadOpen, setIsRateUploadOpen] = useState(false);
  const [isHowToUseOpen, setIsHowToUseOpen] = useState(false);
  const [isWebMCPGuideOpen, setIsWebMCPGuideOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  // Auto-Save active state to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_ACTIVE,
        JSON.stringify({
          nodes,
          edges,
          pricingTier,
          updatedAt: new Date().toISOString(),
        })
      );
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [nodes, edges, pricingTier]);

  // Save library update to localStorage
  const persistSavedLibrary = (updated: SavedArchitectureItem[]) => {
    setSavedArchitectures(updated);
    try {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not persist saved library:', e);
    }
  };

  // Cast nodes and edges for evaluation
  const typedNodes = useMemo(() => {
    return nodes.map((n: any, idx: number) => ({
      id: n.id,
      position: (n.position && typeof n.position.x === 'number' && typeof n.position.y === 'number')
        ? n.position
        : { x: 100 + (idx % 3) * 280, y: 80 + Math.floor(idx / 3) * 180 },
      data: (n.data || {}) as unknown as TopologyNodeData,
    }));
  }, [nodes]);

  const typedEdges = useMemo(() => {
    return edges.map((e: any) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      data: e.data as unknown as TopologyEdgeData | undefined,
    }));
  }, [edges]);

  // Keep node connection state updated and guarantee valid coordinates for React Flow
  const renderedNodes = useMemo(() => {
    return nodes.map((n: any, idx: number) => {
      const isConnected = edges.some((e: any) => e.source === n.id || e.target === n.id);
      const position = (n.position && typeof n.position.x === 'number' && typeof n.position.y === 'number')
        ? n.position
        : { x: 100 + (idx % 3) * 280, y: 80 + Math.floor(idx / 3) * 180 };

      return {
        ...n,
        type: 'customNode',
        position,
        data: {
          ...n.data,
          isConnected,
        },
      };
    });
  }, [nodes, edges]);

  // Re-calculate FinOps summary
  const summary = useMemo(() => {
    return evaluateTopology(typedNodes, typedEdges, pricingTier);
  }, [typedNodes, typedEdges, pricingTier]);

  // Global Plan Change Handler - updates global and all active node cards
  const handleGlobalPricingTierChange = (newTier: PricingTier) => {
    setPricingTier(newTier);
    setNodes((nds: any[]) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          pricingTier: newTier,
        },
      }))
    );
  };

  // Clear Canvas to Blank Slate
  const handleClearCanvas = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
  };

  // Save Current Setup to Local Library
  const handleSaveToLibrary = (name: string, description: string) => {
    const newItem: SavedArchitectureItem = {
      id: `arch-${Date.now()}`,
      name,
      description,
      savedAt: new Date().toISOString(),
      pricingTier,
      summary: {
        totalMonthlySpend: summary.totalMonthlySpend,
        nodeCount: nodes.length,
        edgeCount: edges.length,
      },
      nodes,
      edges,
    };

    const updated = [newItem, ...savedArchitectures.filter(a => a.name !== name)];
    persistSavedLibrary(updated);
  };

  // Load Saved Setup from Local Library
  const handleLoadFromLibrary = (item: SavedArchitectureItem) => {
    setNodes(item.nodes.map((n: any, idx: number) => ({
      ...n,
      type: 'customNode',
      position: (n.position && typeof n.position.x === 'number' && typeof n.position.y === 'number')
        ? n.position
        : { x: 100 + (idx % 3) * 280, y: 80 + Math.floor(idx / 3) * 180 },
    })));
    setEdges(item.edges.map((e: any) => ({ ...e, type: 'customEdge' })));
    setPricingTier(item.pricingTier || 'savings_plan_1yr');
    setSelectedNodeId(null);
  };

  // Delete from Local Library
  const handleDeleteFromLibrary = (id: string) => {
    const updated = savedArchitectures.filter(a => a.id !== id);
    persistSavedLibrary(updated);
  };

  // Import JSON file onto canvas
  const handleImportJSON = (jsonContent: string): boolean => {
    try {
      const parsed = JSON.parse(jsonContent);
      if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
        const importedNodes = parsed.nodes.map((n: any, idx: number) => ({
          ...n,
          type: 'customNode',
          position: (n.position && typeof n.position.x === 'number' && typeof n.position.y === 'number')
            ? n.position
            : { x: 100 + (idx % 3) * 280, y: 80 + Math.floor(idx / 3) * 180 },
          data: {
            ...n.data,
            isConnected: true,
          },
        }));
        const importedEdges = parsed.edges.map((e: any) => ({
          ...e,
          type: 'customEdge',
        }));
        setNodes(importedNodes);
        setEdges(importedEdges);
        if (parsed.pricingTier) setPricingTier(parsed.pricingTier);
        setSelectedNodeId(null);
        return true;
      }
    } catch (e) {
      console.error('Failed to import JSON:', e);
    }
    return false;
  };

  // Custom Rate Sheet / EDA Application
  const handleApplyCustomRateSheet = (rateSheet: CustomRateSheet) => {
    applyRateSheetToCatalog(RESOURCE_SKUS, rateSheet);
    
    // Force re-render of active nodes
    setNodes((nds: any[]) =>
      nds.map((node) => {
        const sku = RESOURCE_SKUS.find((s) => s.id === (node.data as any)?.skuId);
        let baseCost = sku?.monthlyPrice || 0;
        if ((node.data as any)?.serviceType === 'storage' && (node.data as any)?.allocatedStorageGb) {
          baseCost = ((node.data as any).allocatedStorageGb / 1000) * baseCost;
        }
        return {
          ...node,
          data: {
            ...node.data,
            monthlyCost: baseCost * ((node.data as any)?.instances || 1),
          },
        };
      })
    );
  };

  // Synchronize with WebMCP bridge
  useEffect(() => {
    webMCPBridge.updateState(typedNodes, typedEdges, pricingTier);
  }, [typedNodes, typedEdges, pricingTier]);

  // Register WebMCP bridge update callback
  useEffect(() => {
    webMCPBridge.onTopologyUpdate((nextNodes, nextEdges, nextTier) => {
      setNodes(
        nextNodes.map((n, idx) => ({
          ...n,
          type: 'customNode',
          position: n.position || {
            x: 100 + (idx % 3) * 280,
            y: 80 + Math.floor(idx / 3) * 180,
          },
        }))
      );
      setEdges(nextEdges.map(e => ({ ...e, type: 'customEdge' })));
      if (nextTier) setPricingTier(nextTier);
    });
  }, [setNodes, setEdges]);

  // Selected node object
  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    const n = nodes.find((node: any) => node.id === selectedNodeId);
    return n ? { id: n.id, data: (n.data || {}) as unknown as TopologyNodeData } : null;
  }, [selectedNodeId, nodes]);

  // Connect edges
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `e-${params.source}-${params.target}-${Date.now()}`,
        type: 'customEdge',
        animated: true,
        data: {
          monthlyTransferGb: 2000,
          connectionType: 'internet' as const,
          encrypted: true,
          monthlyEgressCost: 0,
          calculatedLatencyMs: 15.0,
        },
      };
      setEdges((eds: any[]) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // Load Preset Architecture
  const handleLoadPreset = (preset: ArchitecturePreset) => {
    setNodes(
      preset.nodes.map((n, idx) => ({
        ...n,
        type: 'customNode',
        position: (n.position && typeof n.position.x === 'number' && typeof n.position.y === 'number')
          ? n.position
          : { x: 100 + (idx % 3) * 280, y: 80 + Math.floor(idx / 3) * 180 },
        data: {
          ...n.data,
          pricingTier: preset.pricingTier,
          isConnected: true,
          isNew: false,
        },
      }))
    );
    setEdges(
      preset.edges.map((e) => ({
        ...e,
        type: 'customEdge',
      }))
    );
    setPricingTier(preset.pricingTier);
    setSelectedNodeId(null);
  };

  // Add new node from palette with glowing "JUST ADDED" animation & center placement
  const handleAddNode = (
    provider: CloudProvider,
    serviceType: ServiceType,
    skuId: string,
    regionId: string
  ) => {
    const sku = RESOURCE_SKUS.find((s) => s.id === skuId);
    const id = `${provider}-${serviceType}-${Date.now()}`;
    const newNode = {
      id,
      type: 'customNode',
      position: {
        x: 350 + Math.random() * 120,
        y: 200 + Math.random() * 120,
      },
      data: {
        label: sku?.name || 'New Resource',
        regionId,
        provider,
        serviceType,
        skuId,
        instances: 1,
        allocatedStorageGb: serviceType === 'storage' ? 2000 : undefined,
        isPII: serviceType === 'database',
        pricingTier,
        monthlyCost: sku?.monthlyPrice || 100,
        isNew: true,
        isConnected: false,
      },
    };

    setNodes((nds: any[]) => [...nds, newNode]);
    setSelectedNodeId(id);

    // Clear "JUST ADDED" glowing animation after 6 seconds
    setTimeout(() => {
      setNodes((nds: any[]) =>
        nds.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, isNew: false } } : n
        )
      );
    }, 6000);
  };

  // Update node data
  const handleUpdateNode = (nodeId: string, updatedData: Partial<TopologyNodeData>) => {
    setNodes((nds: any[]) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          const merged = { ...node.data, ...updatedData } as TopologyNodeData;
          const sku = RESOURCE_SKUS.find((s) => s.id === merged.skuId);
          let baseCost = sku?.monthlyPrice || 0;
          if (merged.serviceType === 'storage' && merged.allocatedStorageGb) {
            baseCost = (merged.allocatedStorageGb / 1000) * baseCost;
          }
          merged.monthlyCost = baseCost * (merged.instances || 1);
          return { ...node, data: merged };
        }
        return node;
      })
    );
  };

  // Delete node
  const handleDeleteNode = (nodeId: string) => {
    setNodes((nds: any[]) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds: any[]) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    setSelectedNodeId(null);
  };

  // Node selection click
  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
    // Dismiss "isNew" animation on click
    setNodes((nds: any[]) =>
      nds.map((n) => (n.id === node.id ? { ...n, data: { ...n.data, isNew: false } } : n))
    );
  };

  const onPaneClick = () => {
    setSelectedNodeId(null);
  };

  // Generated Quote & Terraform
  const activeQuote = useMemo(() => {
    return generateCPQQuote(
      typedNodes,
      typedEdges,
      'Global Enterprise Corp',
      'Multi-Cloud FinOps Topology Quote',
      pricingTier
    );
  }, [typedNodes, typedEdges, pricingTier]);

  const activeTerraformHCL = useMemo(() => {
    return generateTerraformHCL(typedNodes, typedEdges);
  }, [typedNodes, typedEdges]);

  return (
    <div className={`flex flex-col h-screen w-screen transition-colors duration-200 ${theme === 'dark' ? 'dark bg-[#0B0F19] text-gray-100' : 'light bg-[#F8FAFC] text-gray-900'} overflow-hidden select-none`}>
      {/* 2-ROW FinOps Header & Action Bar */}
      <Header
        summary={summary}
        pricingTier={pricingTier}
        theme={theme}
        onPricingTierChange={handleGlobalPricingTierChange}
        onOpenTerraform={() => setIsTerraformOpen(true)}
        onOpenQuote={() => setIsQuoteOpen(true)}
        onOpenRateUpload={() => setIsRateUploadOpen(true)}
        onOpenHowToUse={() => setIsHowToUseOpen(true)}
        onOpenWebMCPGuide={() => setIsWebMCPGuideOpen(true)}
        onClearCanvas={handleClearCanvas}
        onOpenSaveLoad={() => setIsSaveModalOpen(true)}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Workspace: Left Sidebar + Center React Flow Canvas */}
      <div className="flex flex-1 relative overflow-hidden" style={{ height: 'calc(100vh - 6.25rem)' }}>
        <Sidebar
          selectedNode={selectedNode}
          onUpdateNode={handleUpdateNode}
          onDeleteNode={handleDeleteNode}
          onAddNode={handleAddNode}
          onLoadPreset={handleLoadPreset}
          violations={summary.violations}
          savedArchitectures={savedArchitectures}
          onLoadSavedArchitecture={handleLoadFromLibrary}
          onDeleteSavedArchitecture={handleDeleteFromLibrary}
          onOpenSaveModal={() => setIsSaveModalOpen(true)}
        />

        {/* Center Visual Graph Canvas */}
        <main className="flex-1 h-full w-full relative" style={{ height: '100%', width: '100%' }}>
          <ReactFlow
            nodes={renderedNodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultViewport={{ x: 100, y: 50, zoom: 0.85 }}
            minZoom={0.2}
            maxZoom={2}
            className={theme === 'dark' ? 'bg-[#070A10]' : 'bg-[#F8FAFC]'}
            style={{ width: '100%', height: '100%' }}
          >
            <Background 
              variant={BackgroundVariant.Dots} 
              gap={24} 
              size={1.2} 
              color={theme === 'dark' ? '#1F2937' : '#CBD5E1'} 
            />
            <Controls 
              className={theme === 'dark' ? '!bg-gray-900 !border-gray-800 !text-gray-300 !fill-gray-300 shadow-xl' : '!bg-white !border-gray-200 !text-gray-700 !fill-gray-700 shadow-lg'} 
            />
            <MiniMap
              nodeColor={(node) => {
                const data = node.data as unknown as TopologyNodeData;
                if (data?.provider === 'aws') return '#F59E0B';
                if (data?.provider === 'gcp') return '#3B82F6';
                if (data?.provider === 'azure') return '#06B6D4';
                if (data?.provider === 'cloudflare') return '#F97316';
                return '#6B7280';
              }}
              className={theme === 'dark' ? '!bg-gray-950/90 !border !border-gray-800 !rounded-xl !overflow-hidden shadow-2xl' : '!bg-white/95 !border !border-gray-300 !rounded-xl !overflow-hidden shadow-xl'}
              maskColor={theme === 'dark' ? 'rgba(11, 15, 25, 0.7)' : 'rgba(241, 245, 249, 0.7)'}
            />
          </ReactFlow>

          {/* Empty Canvas Overlay State */}
          {renderedNodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="p-8 rounded-2xl dark:bg-[#0B0F19]/90 bg-white/95 border dark:border-gray-800/90 border-gray-300 backdrop-blur-xl max-w-md text-center shadow-2xl pointer-events-auto space-y-4">
                <div className="w-12 h-12 rounded-2xl dark:bg-blue-500/10 bg-blue-100 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border dark:border-blue-500/20 border-blue-200 shadow-md">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold dark:text-gray-100 text-gray-900 tracking-tight">Empty Canvas — Ready to Build</h3>
                  <p className="text-xs dark:text-gray-400 text-gray-600 mt-1.5 leading-relaxed">
                    Start architecting from scratch! Place compute and database nodes from the palette, load a pre-built template, or prompt an AI coding agent via WebMCP.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 pt-2 justify-center">
                  <button
                    onClick={() => handleAddNode('aws', 'compute', 'aws-ec2-m6i-xlarge', 'aws-us-east-1')}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add First Node</span>
                  </button>
                  <button
                    onClick={() => handleLoadPreset(ARCHITECTURE_PRESETS[1])}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl dark:bg-gray-900 bg-gray-100 hover:dark:bg-gray-800 hover:bg-gray-200 border dark:border-gray-700 border-gray-300 dark:text-gray-200 text-gray-800 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Load Template</span>
                  </button>
                  <button
                    onClick={() => setIsSaveModalOpen(true)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl dark:bg-gray-900 bg-gray-100 hover:dark:bg-gray-800 hover:bg-gray-200 border dark:border-gray-700 border-gray-300 dark:text-gray-200 text-gray-800 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Open Library</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Info Floating Chip */}
          <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-lg dark:bg-gray-900/80 bg-white/90 backdrop-blur-md border dark:border-gray-800 border-gray-300 text-[11px] dark:text-gray-400 text-gray-600 font-mono pointer-events-none flex items-center gap-2 shadow-sm">
            <span>🖱️ Drag nodes to organize</span>
            <span>•</span>
            <span>⚡ Connect handles to route traffic</span>
            <span>•</span>
            <span>🤖 External AI Agents connect via WebMCP</span>
          </div>
        </main>
      </div>

      {/* CPQ Quote Modal */}
      <QuoteModal
        quote={activeQuote}
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
      />

      {/* Terraform HCL Modal */}
      <TerraformModal
        hclCode={activeTerraformHCL}
        isOpen={isTerraformOpen}
        onClose={() => setIsTerraformOpen(false)}
      />

      {/* Custom Enterprise Rate Upload Modal */}
      <RateUploadModal
        isOpen={isRateUploadOpen}
        onClose={() => setIsRateUploadOpen(false)}
        onApplyRateSheet={handleApplyCustomRateSheet}
      />

      {/* Save & Manage Architectures Modal */}
      <SaveArchitectureModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        nodes={nodes}
        edges={edges}
        pricingTier={pricingTier}
        summary={summary}
        savedList={savedArchitectures}
        onSaveToLibrary={handleSaveToLibrary}
        onLoadFromLibrary={handleLoadFromLibrary}
        onDeleteFromLibrary={handleDeleteFromLibrary}
        onImportJSON={handleImportJSON}
      />

      {/* How to Use Modal */}
      <HowToUseModal
        isOpen={isHowToUseOpen}
        onClose={() => setIsHowToUseOpen(false)}
      />

      {/* WebMCP Guide & 8 Examples Modal */}
      <WebMCPGuideModal
        isOpen={isWebMCPGuideOpen}
        onClose={() => setIsWebMCPGuideOpen(false)}
      />
    </div>
  );
}
