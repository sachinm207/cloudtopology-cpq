import React from 'react';
import { 
  Cloud, 
  DollarSign, 
  TrendingDown, 
  Zap, 
  ShieldAlert, 
  FileCode, 
  FileText, 
  Sparkles,
  Activity,
  FileJson
} from 'lucide-react';
import { TopologyCostSummary, PricingTier } from '../types/topology';

interface HeaderProps {
  summary: TopologyCostSummary;
  pricingTier: PricingTier;
  onPricingTierChange: (tier: PricingTier) => void;
  onOpenTerraform: () => void;
  onOpenQuote: () => void;
  onOpenAgent: () => void;
  onOpenRateUpload: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  summary,
  pricingTier,
  onPricingTierChange,
  onOpenTerraform,
  onOpenQuote,
  onOpenAgent,
  onOpenRateUpload,
}) => {
  return (
    <header className="h-16 border-b border-gray-800/80 bg-[#0B0F19]/90 backdrop-blur-lg px-4 flex items-center justify-between z-20 select-none">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-500/20 text-white font-bold">
          <Cloud className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-sm text-gray-100 tracking-tight flex items-center gap-1.5">
              CloudTopology <span className="text-blue-400 font-mono text-xs px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">CPQ</span>
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              WebMCP Active
            </span>
          </div>
          <p className="text-[11px] text-gray-400">Multi-Cloud FinOps & Latency Architecture Co-Pilot</p>
        </div>
      </div>

      {/* Real-time FinOps KPI Metrics Bar */}
      <div className="hidden lg:flex items-center gap-2">
        {/* Total Monthly Spend */}
        <div className="px-3 py-1.5 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-medium leading-none">Total Monthly</div>
            <div className="text-xs font-mono font-bold text-gray-100 mt-0.5">
              ${summary.totalMonthlySpend.toLocaleString()}
              <span className="text-[10px] text-gray-400 font-normal">/mo</span>
            </div>
          </div>
        </div>

        {/* FinOps Savings */}
        <div className="px-3 py-1.5 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-medium leading-none">Monthly Savings</div>
            <div className="text-xs font-mono font-bold text-blue-400 mt-0.5">
              ${summary.totalMonthlySavings.toLocaleString()}
              <span className="text-[10px] text-gray-400 font-normal">
                {' '}({summary.onDemandBaseline > 0 ? Math.round((summary.totalMonthlySavings / summary.onDemandBaseline) * 100) : 0}%)
              </span>
            </div>
          </div>
        </div>

        {/* Egress Bandwidth Spend */}
        <div className="px-3 py-1.5 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg ${summary.egressSpend > 200 ? 'bg-amber-500/10 text-amber-400' : 'bg-gray-800 text-gray-400'}`}>
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-medium leading-none">Egress Bill</div>
            <div className="text-xs font-mono font-bold text-amber-400 mt-0.5">
              ${summary.egressSpend.toLocaleString()}
              <span className="text-[10px] text-gray-400 font-normal">/mo</span>
            </div>
          </div>
        </div>

        {/* Latency */}
        <div className="px-3 py-1.5 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-medium leading-none">p95 Latency</div>
            <div className="text-xs font-mono font-bold text-cyan-400 mt-0.5">
              {summary.p95LatencyMs}
              <span className="text-[10px] text-gray-400 font-normal"> ms</span>
            </div>
          </div>
        </div>

        {/* GDPR Compliance */}
        <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2.5 ${
          summary.violations.length > 0
            ? 'bg-amber-950/30 border-amber-500/30 text-amber-300'
            : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
        }`}>
          <ShieldAlert className="w-4 h-4" />
          <div>
            <div className="text-[10px] font-medium leading-none">GDPR & Risk</div>
            <div className="text-xs font-mono font-bold mt-0.5">
              {summary.violations.length === 0 ? 'Compliant' : `${summary.violations.length} Alert${summary.violations.length > 1 ? 's' : ''}`}
            </div>
          </div>
        </div>
      </div>

      {/* Actions & Plan Selector */}
      <div className="flex items-center gap-2">
        {/* Commitment Plan Switcher */}
        <select
          value={pricingTier}
          onChange={(e) => onPricingTierChange(e.target.value as PricingTier)}
          aria-label="FinOps Commitment Plan"
          className="bg-gray-900 border border-gray-700 text-gray-200 text-xs rounded-lg px-2.5 py-1.5 font-mono focus:outline-none focus:border-blue-500"
        >
          <option value="on_demand">On-Demand</option>
          <option value="savings_plan_1yr">1-Yr Savings Plan (~32% off)</option>
          <option value="savings_plan_3yr">3-Yr Savings Plan (~55% off)</option>
          <option value="spot">Spot Instances (~65% off)</option>
        </select>

        {/* Custom Rate Card / JSON Upload Button */}
        <button
          onClick={onOpenRateUpload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 text-xs font-medium transition-all cursor-pointer"
          title="Upload Custom Rate Card or Enterprise Discount Agreement (JSON)"
        >
          <FileJson className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Custom Rates</span>
        </button>

        {/* AI Co-Pilot / Agent Button */}
        <button
          onClick={onOpenAgent}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Co-Pilot</span>
        </button>

        {/* Generate Quote */}
        <button
          onClick={onOpenQuote}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 text-xs font-medium transition-all cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">CPQ Quote</span>
        </button>

        {/* Terraform Export */}
        <button
          onClick={onOpenTerraform}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 text-xs font-medium transition-all cursor-pointer"
        >
          <FileCode className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Terraform</span>
        </button>
      </div>
    </header>
  );
};
