import React, { useState } from 'react';
import { X, Save, Download, Upload, Check, FolderOpen, Trash2 } from 'lucide-react';

import { TopologyCostSummary, PricingTier } from '../types/topology';

export interface SavedArchitectureItem {
  id: string;
  name: string;
  description: string;
  savedAt: string;
  pricingTier: PricingTier;
  summary: {
    totalMonthlySpend: number;
    nodeCount: number;
    edgeCount: number;
  };
  nodes: any[];
  edges: any[];
}

interface SaveArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: any[];
  edges: any[];
  pricingTier: PricingTier;
  summary: TopologyCostSummary;
  savedList: SavedArchitectureItem[];
  onSaveToLibrary: (name: string, description: string) => void;
  onLoadFromLibrary: (item: SavedArchitectureItem) => void;
  onDeleteFromLibrary: (id: string) => void;
  onImportJSON: (jsonContent: string) => boolean;
}

export const SaveArchitectureModal: React.FC<SaveArchitectureModalProps> = ({
  isOpen,
  onClose,
  nodes,
  edges,
  pricingTier,
  summary,
  savedList,
  onSaveToLibrary,
  onLoadFromLibrary,
  onDeleteFromLibrary,
  onImportJSON,
}) => {
  const [activeTab, setActiveTab] = useState<'save' | 'library' | 'export_import'>('save');
  const [archName, setArchName] = useState('My Custom Architecture');
  const [archDescription, setArchDescription] = useState('Custom cloud infrastructure setup designed in CloudTopology CPQ');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  if (!isOpen) return null;

  // Handle Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!archName.trim()) return;
    onSaveToLibrary(archName.trim(), archDescription.trim());
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setActiveTab('library');
    }, 1000);
  };

  // Handle Export File Download
  const handleExportJSON = () => {
    const payload = {
      schemaVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      name: archName || 'CloudTopology Architecture',
      description: archDescription,
      pricingTier,
      totalMonthlySpend: summary.totalMonthlySpend,
      nodes,
      edges,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cloudtopology-${archName.toLowerCase().replace(/\s+/g, '-') || 'architecture'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Handle Import File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(false);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const ok = onImportJSON(content);
        if (ok) {
          setImportSuccess(true);
          setTimeout(() => {
            onClose();
          }, 800);
        } else {
          setImportError('Invalid architecture JSON format. Missing nodes or edges array.');
        }
      } catch (err: any) {
        setImportError(err?.message || 'Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0D121F] border border-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Save className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-100">Save & Manage Architectures</h2>
              <p className="text-xs text-gray-400">Save setups locally, export as JSON, or load previous designs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-800 bg-gray-950/30 px-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('save')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'save'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Current Setup</span>
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'library'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Saved Library ({savedList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('export_import')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'export_import'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export & Import JSON</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: Save Current Architecture */}
          {activeTab === 'save' && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-gray-400">Current Topology: </span>
                  <span className="text-gray-100 font-bold">{nodes.length} Nodes</span>
                  <span className="text-gray-400"> • </span>
                  <span className="text-gray-100 font-bold">{edges.length} Edges</span>
                </div>
                <div className="text-emerald-400 font-bold">
                  ${summary.totalMonthlySpend.toLocaleString()}/mo
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Architecture Name</label>
                <input
                  type="text"
                  value={archName}
                  onChange={(e) => setArchName(e.target.value)}
                  placeholder="e.g. Multi-Tenant Modular Monolith SaaS"
                  className="w-full px-3.5 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs text-gray-100 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Description / Notes</label>
                <textarea
                  value={archDescription}
                  onChange={(e) => setArchDescription(e.target.value)}
                  placeholder="Brief description of the design..."
                  rows={3}
                  className="w-full px-3.5 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs text-gray-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={saveSuccess}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Saved to Local Library!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Architecture</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: Saved Library */}
          {activeTab === 'library' && (
            <div className="space-y-3">
              {savedList.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-xs space-y-2">
                  <FolderOpen className="w-8 h-8 mx-auto text-gray-600" />
                  <p>No saved architectures yet. Save your current canvas from the "Save Current Setup" tab!</p>
                </div>
              ) : (
                savedList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800/80 hover:border-blue-500/40 flex items-center justify-between gap-4 transition-all group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-xs font-bold text-gray-100 truncate">{item.name}</h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          ${item.summary.totalMonthlySpend.toLocaleString()}/mo
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 line-clamp-1">{item.description}</p>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 mt-1">
                        <span>{item.summary.nodeCount} nodes</span>
                        <span>•</span>
                        <span>{item.summary.edgeCount} links</span>
                        <span>•</span>
                        <span>{new Date(item.savedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          onLoadFromLibrary(item);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => onDeleteFromLibrary(item.id)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete saved architecture"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: Export & Import JSON */}
          {activeTab === 'export_import' && (
            <div className="space-y-4">
              {/* Export Box */}
              <div className="p-4 rounded-xl bg-gray-900/40 border border-gray-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-200">
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Export Architecture as JSON</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Download a complete backup of your nodes, links, and FinOps pricing parameters in a portable JSON file.
                </p>
                <button
                  onClick={handleExportJSON}
                  className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm mt-2"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download .json File</span>
                </button>
              </div>

              {/* Import Box */}
              <div className="p-4 rounded-xl bg-gray-900/40 border border-gray-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-200">
                  <Upload className="w-4 h-4 text-blue-400" />
                  <span>Import Architecture from JSON</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Upload any previously exported `.json` topology file to restore it directly onto the visual canvas.
                </p>

                <div className="pt-2">
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold cursor-pointer transition-all shadow-sm">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Select JSON File to Load</span>
                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {importSuccess && (
                  <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Architecture successfully imported and applied to canvas!</span>
                  </div>
                )}

                {importError && (
                  <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
                    ⚠️ {importError}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
