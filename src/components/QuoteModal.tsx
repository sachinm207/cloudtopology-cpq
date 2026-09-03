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
      <div className="dark:bg-[#0F172A] bg-white border dark:border-gray-700 border-gray-300 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b dark:border-gray-800 border-gray-200 flex items-center justify-between dark:bg-gray-950/60 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl dark:bg-emerald-500/10 bg-emerald-100 dark:text-emerald-400 text-emerald-700 border dark:border-emerald-500/20 border-emerald-300">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold dark:text-gray-100 text-gray-900 flex items-center gap-2">
                Enterprise FinOps CPQ Quote
                <span className="font-mono text-xs dark:text-blue-400 text-blue-700 dark:bg-blue-500/10 bg-blue-100 px-2 py-0.5 rounded border dark:border-blue-500/20 border-blue-300">
                  {quote.quoteId}
                </span>
              </h2>
              <p className="text-xs dark:text-gray-400 text-gray-500">Generated on {new Date(quote.generatedAt).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-lg dark:bg-gray-800 bg-gray-200 hover:dark:bg-gray-700 hover:bg-gray-300 dark:text-gray-300 text-gray-700 border dark:border-gray-700 border-gray-300 transition-all cursor-pointer"
              title="Print Quote"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg dark:bg-gray-800 bg-gray-200 hover:dark:bg-gray-700 hover:bg-gray-300 dark:text-gray-300 text-gray-700 border dark:border-gray-700 border-gray-300 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs dark:text-gray-300 text-gray-700">
          {/* Executive Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl dark:bg-gray-900/80 bg-gray-50 border dark:border-gray-800 border-gray-200">
              <span className="text-[11px] dark:text-gray-400 text-gray-500 block mb-1">Total Monthly Spend</span>
              <span className="text-xl font-mono font-extrabold dark:text-emerald-400 text-emerald-700">
                ${quote.summary.totalMonthlySpend.toLocaleString()}
              </span>
              <span className="text-[10px] dark:text-gray-500 text-gray-400 block mt-1">USD / Month</span>
            </div>

            <div className="p-4 rounded-xl dark:bg-gray-900/80 bg-gray-50 border dark:border-gray-800 border-gray-200">
              <span className="text-[11px] dark:text-gray-400 text-gray-500 block mb-1">Monthly FinOps Savings</span>
              <span className="text-xl font-mono font-extrabold text-blue-600 dark:text-blue-400">
                ${quote.summary.totalMonthlySavings.toLocaleString()}
              </span>
              <span className="text-[10px] dark:text-gray-500 text-gray-400 block mt-1">
                {quote.summary.onDemandBaseline > 0 ? Math.round((quote.summary.totalMonthlySavings / quote.summary.onDemandBaseline) * 100) : 0}% vs On-Demand
              </span>
            </div>

            <div className="p-4 rounded-xl dark:bg-gray-900/80 bg-gray-50 border dark:border-gray-800 border-gray-200">
              <span className="text-[11px] dark:text-gray-400 text-gray-500 block mb-1">Annual Contract Value (ACV)</span>
              <span className="text-xl font-mono font-extrabold dark:text-gray-100 text-gray-900">
                ${(quote.summary.totalMonthlySpend * 12).toLocaleString()}
              </span>
              <span className="text-[10px] dark:text-gray-500 text-gray-400 block mt-1">12-Month Run-Rate</span>
            </div>

            <div className="p-4 rounded-xl dark:bg-gray-900/80 bg-gray-50 border dark:border-gray-800 border-gray-200">
              <span className="text-[11px] dark:text-gray-400 text-gray-500 block mb-1">Total Contract Value (3-Yr)</span>
              <span className="text-xl font-mono font-extrabold dark:text-purple-400 text-purple-700">
                ${(quote.summary.totalMonthlySpend * 36).toLocaleString()}
              </span>
              <span className="text-[10px] dark:text-gray-500 text-gray-400 block mt-1">36-Month TCV</span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm dark:text-gray-100 text-gray-900">Itemized Resource Bill of Materials (BOM)</h3>
            <div className="border dark:border-gray-800 border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="dark:bg-gray-900/90 bg-gray-100 border-b dark:border-gray-800 border-gray-200 font-mono text-[11px] dark:text-gray-400 text-gray-600">
                    <th className="p-3">Resource / Description</th>
                    <th className="p-3">Provider</th>
                    <th className="p-3">Region</th>
                    <th className="p-3">Scale</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Monthly Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-800/80 divide-gray-200 font-mono">
                  {quote.lineItems.map((item, i) => (
                    <tr key={i} className="hover:dark:bg-gray-900/40 hover:bg-gray-50">
                      <td className="p-3 font-sans font-medium dark:text-gray-200 text-gray-900">
                        {item.name}
                      </td>
                      <td className="p-3 uppercase text-[10px] font-bold dark:text-gray-400 text-gray-600">
                        {item.provider}
                      </td>
                      <td className="p-3 text-gray-400">
                        {item.region}
                      </td>
                      <td className="p-3 dark:text-gray-200 text-gray-800">
                        {item.quantity}
                      </td>
                      <td className="p-3">
                        <span className="px-1.5 py-0.5 rounded text-[10px] dark:bg-blue-500/10 bg-blue-100 dark:text-blue-300 text-blue-800 border dark:border-blue-500/20 border-blue-300">
                          {item.sku}
                        </span>
                      </td>
                      <td className="p-3 text-right dark:text-gray-400 text-gray-600">
                        ${item.unitPrice.toLocaleString()}/mo
                      </td>
                      <td className="p-3 text-right font-bold dark:text-emerald-400 text-emerald-700">
                        ${item.monthlyTotal.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t dark:border-gray-800 border-gray-200 dark:bg-gray-950/80 bg-gray-50 flex items-center justify-between">
          <div className="text-[11px] dark:text-gray-400 text-gray-600">
            Approved CPQ Document • Valid for 30 days from generation date.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
