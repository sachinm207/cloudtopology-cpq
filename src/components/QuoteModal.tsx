import React from 'react';
import { X, Printer, CheckCircle } from 'lucide-react';
import { CPQQuote } from '../types/topology';

interface QuoteModalProps {
  quote: CPQQuote | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ quote, isOpen, onClose }) => {
  if (!isOpen || !quote) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#0F172A] border border-gray-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-gray-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-100 flex items-center gap-2">
                Enterprise FinOps CPQ Quote
                <span className="font-mono text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  {quote.quoteId}
                </span>
              </h2>
              <p className="text-xs text-gray-400">Generated on {new Date(quote.generatedAt).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition-all cursor-pointer"
              title="Print Quote"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-300">
          {/* Executive Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800">
              <span className="text-[11px] text-gray-400 block mb-1">Total Monthly Spend</span>
              <span className="text-xl font-mono font-extrabold text-emerald-400">
                ${quote.summary.totalMonthlySpend.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-500 block mt-1">USD / Month</span>
            </div>
            <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800">
              <span className="text-[11px] text-gray-400 block mb-1">Commitment Savings</span>
              <span className="text-xl font-mono font-extrabold text-blue-400">
                ${quote.summary.totalMonthlySavings.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-500 block mt-1">vs On-Demand Baseline</span>
            </div>
            <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800">
              <span className="text-[11px] text-gray-400 block mb-1">Egress Bandwidth Bill</span>
              <span className="text-xl font-mono font-extrabold text-amber-400">
                ${quote.summary.egressSpend.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-500 block mt-1">Inter-region data transfer</span>
            </div>
            <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800">
              <span className="text-[11px] text-gray-400 block mb-1">Global 95th Latency</span>
              <span className="text-xl font-mono font-extrabold text-cyan-400">
                {quote.summary.p95LatencyMs} ms
              </span>
              <span className="text-[10px] text-gray-500 block mt-1">Speed-of-light fiber RTT</span>
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Resource Line Items</h3>
            <div className="rounded-xl border border-gray-800 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-900/80 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-800">
                  <tr>
                    <th className="p-3">Resource / Component</th>
                    <th className="p-3">Cloud & Region</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Monthly Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-mono">
                  {quote.lineItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-800/40">
                      <td className="p-3 font-sans font-medium text-gray-200">{item.name}</td>
                      <td className="p-3 text-gray-400 font-sans">
                        <span className="px-1.5 py-0.5 rounded bg-gray-800 text-[10px] uppercase font-mono mr-1.5">
                          {item.provider}
                        </span>
                        {item.region}
                      </td>
                      <td className="p-3 text-gray-400">{item.sku}</td>
                      <td className="p-3 text-right text-gray-300">{item.quantity}</td>
                      <td className="p-3 text-right font-bold text-emerald-400">${item.monthlyTotal.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Egress Breakdown Table */}
          {quote.egressBreakdown.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Inter-Region Data Transfer Breakdown</h3>
              <div className="rounded-xl border border-gray-800 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-900/80 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-800">
                    <tr>
                      <th className="p-3">Source Node</th>
                      <th className="p-3">Destination Node</th>
                      <th className="p-3 text-right">Volume (TB)</th>
                      <th className="p-3 text-right">Rate ($/GB)</th>
                      <th className="p-3 text-right">Egress Bill</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 font-mono">
                    {quote.egressBreakdown.map((e, idx) => (
                      <tr key={idx} className="hover:bg-gray-800/40">
                        <td className="p-3 font-sans text-gray-200">{e.source}</td>
                        <td className="p-3 font-sans text-gray-200">{e.destination}</td>
                        <td className="p-3 text-right text-gray-300">{e.transferTb} TB</td>
                        <td className="p-3 text-right text-gray-400">${e.effectiveRatePerGb}</td>
                        <td className="p-3 text-right font-bold text-amber-400">${e.monthlyCost.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-800 bg-gray-950/60 flex items-center justify-between">
          <span className="text-xs text-gray-400">Approved for enterprise billing & cloud provisioning</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Close CPQ Quote
          </button>
        </div>
      </div>
    </div>
  );
};
