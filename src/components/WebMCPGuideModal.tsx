import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  Terminal, 
  Copy, 
  Check, 
  Code2, 
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
      title: 'Apply 3-Year Enterprise Savings Plan Discounts',
      category: 'FinOps Optimization',
      userPrompt: 'Apply 3-Year Savings Plans across all steady-state compute and database nodes to maximize contract savings.',
      toolName: 'optimize_cloud_architecture',
      toolPayload: { strategy: 'cost_cut_savings_plans' },
      expectedResult: 'Converts eligible compute and database nodes to 3-Year Savings Plans, slashing monthly spend by ~55%.',
      icon: TrendingDown,
    },
    {
      id: 4,
      title: 'Simulate 25 TB Traffic Surge and Egress Cost Spikes',
      category: 'Traffic Simulation',
      userPrompt: 'Simulate 25,000 GB/month data transfer on our primary US-to-Europe API link and compute the exact dollar impact.',
      toolName: 'simulate_traffic_and_egress',
      toolPayload: { edgeId: 'e-us-app-eu-app', monthlyTransferGb: 25000, connectionType: 'internet' },
      expectedResult: 'Computes piecewise tiered egress fees across 10TB/40TB brackets in <10ms and updates canvas particle flow.',
      icon: Layers,
    },
    {
      id: 5,
      title: 'Query Multi-Cloud SKU Catalog for GPU Instances',
      category: 'Catalog & Discovery',
      userPrompt: 'List all available GPU compute instances across AWS, GCP, and Azure with hourly and monthly pricing.',
      toolName: 'list_cloud_regions_and_skus',
      toolPayload: { provider: 'all', serviceType: 'compute' },
      expectedResult: 'Returns AWS g5.2xlarge (A10G), GCP a2-highgpu-1g (A100), and Azure D4s_v5 with allowed commitment rules.',
      icon: Search,
    },
    {
      id: 6,
      title: 'Programmatically Apply Multi-Region Failover Cluster',
      category: 'Topology Mutation',
      userPrompt: 'Add a secondary compute cluster in Tokyo (ap-northeast-1) with 4 instances and connect it to Aurora PostgreSQL.',
      toolName: 'apply_topology_to_canvas',
      toolPayload: {
        nodes: [
          { id: 'aws-tokyo-api', label: 'Tokyo API Cluster', provider: 'aws', regionId: 'aws-ap-northeast-1', skuId: 'aws-ec2-c6i-2xlarge', instances: 4, isPII: false }
        ],
        edges: [
          { id: 'e-tokyo-db', source: 'aws-tokyo-api', target: 'aurora-db-1', monthlyTransferGb: 3000, connectionType: 'vpc_peering' }
        ]
      },
      expectedResult: 'Directly updates the live visual React Flow DOM and re-calculates all FinOps KPIs.',
      icon: Code2,
    },
    {
      id: 7,
      title: 'Apply Custom Enterprise Discount Agreement (EDA)',
      category: 'Enterprise Rates',
      userPrompt: 'Apply our Fortune 500 Enterprise Discount Agreement with a 15% blanket discount across all cloud instances and $0.04/GB egress.',
      toolName: 'apply_enterprise_rate_sheet',
      toolPayload: {
        enterpriseName: 'Fortune 500 Global Agreement',
        blanketDiscountPercent: 15.0,
        customEgressRatePerGb: 0.04,
      },
      expectedResult: 'Overrides in-memory catalog pricing, applies corporate discount brackets, and synchronizes live canvas cards.',
      icon: FileJson,
    },
    {
      id: 8,
      title: 'Export Production Terraform HCL & Enterprise CPQ Quote',
      category: 'Export & IaC',
      userPrompt: 'Export production Terraform HCL 2.0 and generate a formal CPQ Quote PDF for "Global FinTech Corp".',
      toolName: 'export_terraform_iac',
      toolPayload: { clientName: 'Global FinTech Corp', projectTitle: 'Multi-Region Sovereign Core' },
      expectedResult: 'Generates deployable main.tf HCL code with aws_instance, rds_cluster, and formal CPQ line items.',
      icon: FileCode,
    },
  ];

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = ['all', 'FinOps Optimization', 'Enterprise Rates', 'Compliance & Audit', 'Traffic Simulation', 'Catalog & Discovery', 'Topology Mutation', 'Export & IaC'];
  const filteredExamples = selectedCategory === 'all' ? examples : examples.filter(e => e.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#0B0F19] border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-600/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-gray-100">How to Use WebMCP & Real-World Examples</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  8 WebMCP Tools Live
                </span>
              </div>
              <p className="text-xs text-gray-400">Connect ChatGPT Desktop, Claude, or autonomous AI agents to your visual topology</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* How WebMCP Works Box */}
          <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-100">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>How WebMCP Connection Works</span>
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              When an AI agent (such as <strong>ChatGPT Desktop</strong> or <strong>Google Chrome with <code className="text-blue-300">#enable-webmcp-testing</code></strong>) loads this webpage, it discovers 8 typed tools registered on <code className="text-emerald-300">document.modelContext</code>. The AI reasons in natural language and calls tools to inspect, simulate, or mutate the visual canvas in <strong>&lt;10ms</strong>.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-gray-900/80 text-gray-400 hover:bg-gray-800 border border-gray-800'
                }`}
              >
                {cat === 'all' ? 'All 8 Examples' : cat}
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
                  className="p-4 rounded-xl bg-gray-900/40 border border-gray-800 hover:border-emerald-500/40 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-bold text-gray-100">Example {ex.id}: {ex.title}</h3>
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-gray-800 text-gray-300 border border-gray-700">
                            {ex.category}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                          Tool: {ex.toolName}()
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(ex.id, ex.userPrompt)}
                      className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer border border-gray-700"
                      title="Copy prompt for AI agent"
                    >
                      {copiedId === ex.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
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
                  <div className="p-2.5 rounded-lg bg-gray-950 border border-gray-800/80">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 block mb-1">
                      💬 Natural Language Prompt to AI Agent:
                    </span>
                    <p className="text-xs text-gray-200 font-mono italic">"{ex.userPrompt}"</p>
                  </div>

                  {/* WebMCP Tool JSON Schema & Result */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-lg bg-gray-950/80 border border-gray-800/60 font-mono">
                      <span className="text-[10px] uppercase font-bold text-blue-400 block mb-1">
                        📦 WebMCP Payload:
                      </span>
                      <pre className="text-gray-300 text-[10px] overflow-x-auto">
                        {JSON.stringify(ex.toolPayload, null, 2)}
                      </pre>
                    </div>
                    <div className="p-2.5 rounded-lg bg-gray-950/80 border border-gray-800/60">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">
                        ⚡ Real-Time Result:
                      </span>
                      <p className="text-gray-300 leading-relaxed text-[11px]">{ex.expectedResult}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-800 bg-gray-950/80 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">All 8 tools registered and ready on <code className="text-emerald-400 font-mono">document.modelContext</code></span>
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
