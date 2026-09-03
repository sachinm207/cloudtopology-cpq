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

import { TopologyNodeData, TopologyEdgeData, PricingTier, CloudProvider, ServiceType } from './types/topology';
import { ARCHITECTURE_PRESETS, ArchitecturePreset } from './data/presets';
import { evaluateTopology, generateCPQQuote } from './engine/finopsEngine';
import { generateTerraformHCL } from './engine/terraformGenerator';
import { webMCPBridge } from './tools/modelContextBridge';
import { RESOURCE_SKUS } from './data/catalog';
import { CustomRateSheet, applyRateSheetToCatalog } from './engine/rateCardParser';

const nodeTypes = {
  customNode: CustomNode,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

export function App() {
  const initialPreset = ARCHITECTURE_PRESETS[0];

  const [nodes, setNodes, onNodesChange] = useNodesState<any>(
    initialPreset.nodes.map((n) => ({
      ...n,
      type: 'customNode',
      data: {
        ...n.data,
        pricingTier: initialPreset.pricingTier,
        isConnected: true,
      },
    }))
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState<any>(
    initialPreset.edges.map((e) => ({
      ...e,
      type: 'customEdge',
    }))
  );

  const [pricingTier, setPricingTier] = useState<PricingTier>(initialPreset.pricingTier);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  // Modals state
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isTerraformOpen, setIsTerraformOpen] = useState(false);
  const [isRateUploadOpen, setIsRateUploadOpen] = useState(false);
  const [isHowToUseOpen, setIsHowToUseOpen] = useState(false);
  const [isWebMCPGuideOpen, setIsWebMCPGuideOpen] = useState(false);

  // Cast nodes and edges for evaluation
  const typedNodes = useMemo(() => {
    return nodes.map(n => ({
      id: n.id,
      data: (n.data || {}) as unknown as TopologyNodeData,
    }));
  }, [nodes]);

  const typedEdges = useMemo(() => {
    return edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      data: e.data as unknown as TopologyEdgeData | undefined,
    }));
  }, [edges]);

  // Keep node connection state updated
  const renderedNodes = useMemo(() => {
    return nodes.map((n) => {
      const isConnected = edges.some((e) => e.source === n.id || e.target === n.id);
      return {
        ...n,
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
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          pricingTier: newTier,
        },
      }))
    );
  };

  // Custom Rate Sheet / EDA Application
  const handleApplyCustomRateSheet = (rateSheet: CustomRateSheet) => {
    applyRateSheetToCatalog(RESOURCE_SKUS, rateSheet);
    
    // Force re-render of active nodes
    setNodes((nds) =>
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
      setNodes(nextNodes.map(n => ({ ...n, type: 'customNode' })));
      setEdges(nextEdges.map(e => ({ ...e, type: 'customEdge' })));
      if (nextTier) setPricingTier(nextTier);
    });
  }, [setNodes, setEdges]);

  // Selected node object
  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    const n = nodes.find((node) => node.id === selectedNodeId);
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
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // Load Preset Architecture
  const handleLoadPreset = (preset: ArchitecturePreset) => {
    setNodes(
      preset.nodes.map((n) => ({
        ...n,
        type: 'customNode',
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

    setNodes((nds) => [...nds, newNode]);
    setSelectedNodeId(id);

    // Clear "JUST ADDED" glowing animation after 6 seconds
    setTimeout(() => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, isNew: false } } : n
        )
      );
    }, 6000);
  };

  // Update node data
  const handleUpdateNode = (nodeId: string, updatedData: Partial<TopologyNodeData>) => {
    setNodes((nds) =>
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
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    setSelectedNodeId(null);
  };

  // Node selection click
  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
    // Dismiss "isNew" animation on click
    setNodes((nds) =>
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
    <div className="flex flex-col h-screen w-screen bg-[#0B0F19] text-gray-100 overflow-hidden select-none">
      {/* 2-ROW FinOps Header & Action Bar */}
      <Header
        summary={summary}
        pricingTier={pricingTier}
        onPricingTierChange={handleGlobalPricingTierChange}
        onOpenTerraform={() => setIsTerraformOpen(true)}
        onOpenQuote={() => setIsQuoteOpen(true)}
        onOpenRateUpload={() => setIsRateUploadOpen(true)}
        onOpenHowToUse={() => setIsHowToUseOpen(true)}
        onOpenWebMCPGuide={() => setIsWebMCPGuideOpen(true)}
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
            className="bg-[#070A10]"
            style={{ width: '100%', height: '100%' }}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1.2} color="#1F2937" />
            <Controls className="!bg-gray-900 !border-gray-800 !text-gray-300 !fill-gray-300 shadow-xl" />
            <MiniMap
              nodeColor={(node) => {
                const data = node.data as unknown as TopologyNodeData;
                if (data?.provider === 'aws') return '#F59E0B';
                if (data?.provider === 'gcp') return '#3B82F6';
                if (data?.provider === 'azure') return '#06B6D4';
                if (data?.provider === 'cloudflare') return '#F97316';
                return '#6B7280';
              }}
              className="!bg-gray-950/90 !border !border-gray-800 !rounded-xl !overflow-hidden shadow-2xl"
              maskColor="rgba(11, 15, 25, 0.7)"
            />
          </ReactFlow>

          {/* Quick Info Floating Chip */}
          <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-lg bg-gray-900/80 backdrop-blur-md border border-gray-800 text-[11px] text-gray-400 font-mono pointer-events-none flex items-center gap-2">
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
