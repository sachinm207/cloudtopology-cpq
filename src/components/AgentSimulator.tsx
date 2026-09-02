import React, { useState } from 'react';
import { 
  Sparkles, 
  Terminal, 
  Send, 
  Zap, 
  Code2, 
  X,
  ArrowRight
} from 'lucide-react';
import { webMCPBridge } from '../tools/modelContextBridge';

interface AgentSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshTopology: () => void;
}

interface Message {
  sender: 'user' | 'agent' | 'system';
  text: string;
  toolCall?: {
    name: string;
    params: any;
    result: any;
  };
}

export const AgentSimulator: React.FC<AgentSimulatorProps> = ({
  isOpen,
  onClose,
  onRefreshTopology,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'agent',
      text: 'Hello! I am your Multi-Cloud FinOps Co-Pilot. I am connected directly to your visual architecture via WebMCP tools. You can ask me to cut egress costs, fix GDPR violations, optimize commitment plans, or simulate high-volume traffic.',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'tools'>('chat');

  const tools = webMCPBridge.getAllTools();

  const handleSend = async (queryText?: string) => {
    const query = queryText || inputQuery;
    if (!query.trim() || isProcessing) return;

    setInputQuery('');
    setMessages((prev) => [...prev, { sender: 'user', text: query }]);
    setIsProcessing(true);

    try {
      const lower = query.toLowerCase();

      if (lower.includes('egress') || lower.includes('bandwidth') || lower.includes('cloudflare') || lower.includes('cut cost')) {
        const result = await webMCPBridge.executeTool('optimize_cloud_architecture', {
          strategy: 'zero_egress_edge_cache',
        });
        onRefreshTopology();

        setMessages((prev) => [
          ...prev,
          {
            sender: 'agent',
            text: `I've analyzed your inter-region traffic and injected Cloudflare Global CDN edge caching with zero-egress tunneling. This cut your monthly egress fees and brought your total spend down to $${result.newTotalMonthlySpend.toLocaleString()}/mo!`,
            toolCall: {
              name: 'optimize_cloud_architecture',
              params: { strategy: 'zero_egress_edge_cache' },
              result,
            },
          },
        ]);
      } else if (lower.includes('gdpr') || lower.includes('frankfurt') || lower.includes('europe') || lower.includes('pii') || lower.includes('compliance')) {
        const result = await webMCPBridge.executeTool('optimize_cloud_architecture', {
          strategy: 'fix_gdpr_compliance',
        });
        onRefreshTopology();

        setMessages((prev) => [
          ...prev,
          {
            sender: 'agent',
            text: `I audited the topology and relocated your PII database to Europe (Frankfurt aws-eu-central-1) to satisfy EU data residency statutes. Your topology is now 100% GDPR compliant!`,
            toolCall: {
              name: 'optimize_cloud_architecture',
              params: { strategy: 'fix_gdpr_compliance' },
              result,
            },
          },
        ]);
      } else if (lower.includes('savings plan') || lower.includes('3-year') || lower.includes('reserved') || lower.includes('discount')) {
        const result = await webMCPBridge.executeTool('optimize_cloud_architecture', {
          strategy: 'cost_cut_savings_plans',
        });
        onRefreshTopology();

        setMessages((prev) => [
          ...prev,
          {
            sender: 'agent',
            text: `Applied 3-Year Savings Plans across steady-state compute and database nodes, reducing your monthly bill by $${result.monthlySavingsAchieved.toLocaleString()}/month (~55% savings).`,
            toolCall: {
              name: 'optimize_cloud_architecture',
              params: { strategy: 'cost_cut_savings_plans' },
              result,
            },
          },
        ]);
      } else if (lower.includes('summary') || lower.includes('audit') || lower.includes('status') || lower.includes('latency')) {
        const result = await webMCPBridge.executeTool('get_topology_summary', {});
        setMessages((prev) => [
          ...prev,
          {
            sender: 'agent',
            text: `Current topology has ${result.nodeCount} nodes and ${result.edgeCount} connection links. Total monthly bill is $${result.costSummary.totalMonthlySpend.toLocaleString()}/mo with a 95th latency of ${result.costSummary.p95LatencyMs}ms and ${result.costSummary.violations.length} compliance warnings.`,
            toolCall: {
              name: 'get_topology_summary',
              params: {},
              result,
            },
          },
        ]);
      } else {
        const result = await webMCPBridge.executeTool('optimize_cloud_architecture', {
          strategy: 'all_optimizations',
        });
        onRefreshTopology();

        setMessages((prev) => [
          ...prev,
          {
            sender: 'agent',
            text: `Executed full multi-cloud FinOps optimization: applied 3-Year Savings Plans, moved PII databases to EU regions, and enabled zero-egress edge caching. New monthly spend: $${result.newTotalMonthlySpend.toLocaleString()}/mo!`,
            toolCall: {
              name: 'optimize_cloud_architecture',
              params: { strategy: 'all_optimizations' },
              result,
            },
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: `Error executing WebMCP tool: ${err?.message || 'Unknown error'}`,
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-96 bg-[#0B0F19] border-l border-gray-800 shadow-2xl flex flex-col backdrop-blur-xl">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-950/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-gray-100 flex items-center gap-1.5">
              FinOps AI Agent
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                WebMCP Live
              </span>
            </h2>
            <p className="text-[10px] text-gray-400">Talk or Touch Architecture Co-Pilot</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 border-b border-gray-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('chat')}
          className={`py-2.5 flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${
            activeTab === 'chat'
              ? 'border-blue-500 text-blue-400 bg-blue-500/5'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Agent Chat</span>
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          className={`py-2.5 flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${
            activeTab === 'tools'
              ? 'border-blue-500 text-blue-400 bg-blue-500/5'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>WebMCP Registry ({tools.length})</span>
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'chat' ? (
        <div className="flex-1 flex flex-col justify-between overflow-hidden p-3 space-y-3">
          {/* Quick Action Prompt Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              'Cut cross-Atlantic egress bill',
              'Fix GDPR data residency for EU',
              'Apply 3-Yr commitment savings',
              'Audit network latency & bottlenecks',
            ].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="px-2 py-1 rounded-md bg-gray-900/80 hover:bg-gray-800 border border-gray-700/60 text-[10px] text-gray-300 transition-all text-left flex items-center gap-1 cursor-pointer"
              >
                <span>{prompt}</span>
                <ArrowRight className="w-2.5 h-2.5 text-blue-400 opacity-70" />
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-xl max-w-[90%] text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white font-medium'
                      : 'bg-gray-900 border border-gray-800 text-gray-200 shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>

                {/* WebMCP Tool Call Badge */}
                {msg.toolCall && (
                  <div className="mt-1.5 p-2 rounded-lg bg-gray-950 border border-gray-800 font-mono text-[10px] text-gray-400 max-w-[90%] space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <Zap className="w-3 h-3" />
                      <span>WebMCP: {msg.toolCall.name}()</span>
                    </div>
                    <div className="text-[9px] text-gray-500 truncate">
                      Input: {JSON.stringify(msg.toolCall.params)}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isProcessing && (
              <div className="flex items-center gap-2 text-xs text-blue-400 font-mono py-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
                <span>Executing WebMCP tool on client engine...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="pt-2 border-t border-gray-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask FinOps agent to optimize topology..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={isProcessing}
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* TOOLS REGISTRY TAB */
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <div className="text-[11px] text-gray-400 mb-2">
            The following typed WebMCP tools are registered on <code className="text-blue-400 font-mono">document.modelContext</code>:
          </div>
          {tools.map((tool) => (
            <div key={tool.name} className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-400">{tool.name}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  Registered
                </span>
              </div>
              <p className="text-[11px] text-gray-300 leading-snug">{tool.description}</p>
              <div className="p-2 rounded bg-gray-950 font-mono text-[9px] text-gray-400 overflow-x-auto">
                <pre>{JSON.stringify(tool.inputSchema, null, 2)}</pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
