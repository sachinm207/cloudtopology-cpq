import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  Terminal, 
  Copy, 
  Check, 
 
  Layers, 
  Zap, 
  ShieldAlert, 
  TrendingDown, 
  FileCode, 
  Search, 
  FileJson 
} from 'lucide-react';

interface WebMCPGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WebMCPExample {
  id: number;
  title: string;
  category: string;
  userPrompt: string;
  toolName: string;
  toolPayload: Record<string, any>;
  expectedResult: string;
  icon: any;
}

export const WebMCPGuideModal: React.FC<WebMCPGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const examples: WebMCPExample[] = [
    {
      id: 1,
      title: 'Audit GDPR Data Residency & Speed-of-Light Latency',
      category: 'Compliance & Audit',
      userPrompt: 'Audit our active topology for GDPR compliance and report the p95 fiber latency across all global links.',
      toolName: 'validate_compliance_and_latency',
      toolPayload: {},
      expectedResult: 'Returns GDPR violations, unencrypted public transit links, and p95 speed-of-light optical latency matrix.',
      icon: ShieldAlert,
    },
    {
      id: 2,
      title: 'Cut Cross-Atlantic Egress by Injecting Edge Caching',
      category: 'FinOps Optimization',
      userPrompt: 'Cut our AWS cross-region egress bill by injecting Cloudflare zero-egress edge caching and Bandwidth Alliance routing.',
      toolName: 'optimize_cloud_architecture',
      toolPayload: { strategy: 'zero_egress_edge_cache' },
      expectedResult: 'Injects Cloudflare Global CDN edge node, switches cross-region routes to zero-egress tunnels, cutting bandwidth bills to $0.',
      icon: Zap,
    },
    {
      id: 3,
      title: 'Relocate PII Databases to Frankfurt (aws-eu-central-1)',
      category: 'Compliance & Audit',
      userPrompt: 'Move all user database nodes containing EU PII customer data to Frankfurt to achieve 100% GDPR compliance.',
      toolName: 'optimize_cloud_architecture',
      toolPayload: { strategy: 'fix_gdpr_compliance' },
      expectedResult: 'Shifts PII databases to Frankfurt datacenter, eliminating compliance violations.',
      icon: ShieldAlert,
    },
    {
      id: 4,
      title: 'Apply 3-Year Enterprise Savings Plans Globally',
      category: 'FinOps Optimization',
      userPrompt: 'Switch all eligible compute and database nodes to 3-Year Savings Plans to maximize our FinOps discount.',
      toolName: 'optimize_cloud_architecture',
      toolPayload: { strategy: 'cost_cut_savings_plans' },
      expectedResult: 'Applies up to 55% commitment discounts across all eligible multi-cloud nodes.',
      icon: TrendingDown,
    },
    {
      id: 5,
      title: 'Simulate High-Throughput DB Replication Egress Traffic',
      category: 'Traffic Simulation',
      userPrompt: 'Simulate 25,000 GB/month database replication traffic between Frankfurt and US East via private VPC peering.',
      toolName: 'simulate_traffic_and_egress',
      toolPayload: {
        edgeId: 'e-db-replication',
        monthlyTransferGb: 25000,
        connectionType: 'vpc_peering',
      },
      expectedResult: 'Recalculates exact egress tier pricing and adjusts visual particle animation speed.',
      icon: Layers,
    },
    {
      id: 6,
      title: 'Synthesize Production Terraform HCL 2.0 IaC',
      category: 'IaC & Export',
      userPrompt: 'Generate production-ready Terraform HCL configuration with multi-provider definitions and security groups for this topology.',
      toolName: 'export_terraform_iac',
      toolPayload: {},
      expectedResult: 'Returns ready-to-run Terraform HCL 2.0 module code and formal CPQ Quote.',
      icon: FileCode,
    },
    {
      id: 7,
      title: 'Query Multi-Cloud SKU Catalog for H100 / A100 AI GPUs',
      category: 'SKU Discovery',
      userPrompt: 'List all available NVIDIA H100 and A100 GPU compute SKUs across AWS, GCP, and Azure with pricing.',
      toolName: 'list_cloud_regions_and_skus',
      toolPayload: { serviceType: 'compute' },
      expectedResult: 'Returns 50+ enterprise SKUs including AWS p5.48xlarge, GCP A3, and Azure ND96isr.',
      icon: Search,
    },
    {
      id: 8,
      title: 'Apply 15% Corporate Enterprise Discount Agreement (EDA)',
      category: 'FinOps Optimization',
      userPrompt: 'Apply our custom Acme Corp Enterprise Agreement with 15% blanket discount and $0.045/GB egress rate.',
      toolName: 'apply_enterprise_rate_sheet',
      toolPayload: {
        enterpriseName: 'Acme Corp Global EA',
        blanketDiscountPercent: 15.0,
        customEgressRatePerGb: 0.045,
      },
      expectedResult: 'Applies custom negotiated corporate rates across all nodes and edges in real time.',
      icon: FileJson,
    },
  ];

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = ['all', 'Compliance & Audit', 'FinOps Optimization', 'Traffic Simulation', 'IaC & Export', 'SKU Discovery'];

  const filteredExamples = selectedCategory === 'all'
    ? examples
    : examples.filter(ex => ex.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="dark:bg-[#0D121F] bg-white border dark:border-gray-800 border-gray-300 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b dark:border-gray-800 border-gray-200 flex items-center justify-between dark:bg-gray-950/60 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold dark:text-gray-100 text-gray-900">WebMCP Developer Guide & Examples</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono dark:bg-emerald-500/10 bg-emerald-50 text-emerald-700 dark:text-emerald-400 border dark:border-emerald-500/20 border-emerald-300">
                  8 Tools Live
                </span>
              </div>
              <p className="text-xs dark:text-gray-400 text-gray-500">
                Connect external AI Coding Agents (ChatGPT, Claude, Gemini, Cursor) directly to this browser canvas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg dark:text-gray-400 text-gray-500 hover:dark:text-gray-200 hover:text-gray-800 hover:dark:bg-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Quick Explainer Card */}
          <div className="p-4 rounded-xl dark:bg-gray-900/60 bg-gray-50 border dark:border-gray-800 border-gray-200 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold dark:text-emerald-400 text-emerald-700 font-mono">
              <Terminal className="w-4 h-4" />
              <span>How WebMCP Works with External AI Agents</span>
            </div>
            <p className="text-xs dark:text-gray-300 text-gray-700 leading-relaxed">
              CloudTopology CPQ exposes standard MCP tools on the browser's global <code className="dark:text-blue-400 text-blue-600 font-mono">window.modelContext</code> object. Any AI Agent with browser tools (e.g., ChatGPT Browser, Claude Computer Use, Antigravity) can read the topology, optimize costs, simulate egress bills, and synthesize Terraform IaC automatically.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'dark:bg-gray-900/60 bg-gray-100 dark:border-gray-800 border-gray-300 dark:text-gray-400 text-gray-600 hover:dark:bg-gray-800 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'All Examples (8)' : cat}
              </button>
            ))}
          </div>

          {/* Examples Grid */}
          <div className="space-y-3.5">
            {filteredExamples.map((ex) => {
              const Icon = ex.icon;
              return (
                <div
                  key={ex.id}
                  className="p-4 rounded-xl dark:bg-gray-900/40 bg-gray-50 border dark:border-gray-800 border-gray-200 hover:dark:border-emerald-500/40 hover:border-emerald-300 transition-all space-y-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg dark:bg-emerald-500/10 bg-emerald-100 text-emerald-700 dark:text-emerald-400 border dark:border-emerald-500/20 border-emerald-300">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-bold dark:text-gray-100 text-gray-900">Example {ex.id}: {ex.title}</h3>
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded dark:bg-gray-800 bg-gray-200 dark:text-gray-300 text-gray-700 border dark:border-gray-700 border-gray-300">
                            {ex.category}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                          Tool: {ex.toolName}()
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(ex.id, ex.userPrompt)}
                      className="px-2.5 py-1 rounded-lg dark:bg-gray-800 bg-white hover:dark:bg-gray-700 hover:bg-gray-100 dark:text-gray-300 text-gray-700 text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer border dark:border-gray-700 border-gray-300 shadow-sm"
                      title="Copy prompt for AI agent"
                    >
                      {copiedId === ex.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Natural Language Prompt */}
                  <div className="p-2.5 rounded-lg dark:bg-gray-950 bg-white border dark:border-gray-800/80 border-gray-200 shadow-sm">
                    <span className="text-[10px] uppercase tracking-wider font-bold dark:text-gray-500 text-gray-400 block mb-1">
                      💬 Natural Language Prompt to AI Agent:
                    </span>
                    <p className="text-xs dark:text-gray-200 text-gray-800 font-mono italic">"{ex.userPrompt}"</p>
                  </div>

                  {/* WebMCP Tool JSON Schema & Result */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-lg dark:bg-gray-950/80 bg-white border dark:border-gray-800/60 border-gray-200 font-mono shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block mb-1">
                        📦 WebMCP Payload:
                      </span>
                      <pre className="dark:text-gray-300 text-gray-700 text-[10px] overflow-x-auto">
                        {JSON.stringify(ex.toolPayload, null, 2)}
                      </pre>
                    </div>
                    <div className="p-2.5 rounded-lg dark:bg-gray-950/80 bg-white border dark:border-gray-800/60 border-gray-200 shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                        ⚡ Real-Time Result:
                      </span>
                      <p className="dark:text-gray-300 text-gray-700 leading-relaxed text-[11px]">{ex.expectedResult}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t dark:border-gray-800 border-gray-200 dark:bg-gray-950/80 bg-gray-50 flex items-center justify-between">
          <span className="text-[11px] dark:text-gray-400 text-gray-500">All 8 tools registered and ready on <code className="text-emerald-600 dark:text-emerald-400 font-mono">document.modelContext</code></span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer shadow-lg shadow-blue-600/20"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
