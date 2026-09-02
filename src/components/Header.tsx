import React from 'react';
import { 
  Cloud, 
  DollarSign, 
  TrendingDown, 
  Zap, 
  ShieldAlert, 
  FileCode, 
  FileText, 
  Activity,
  FileJson,
  BookOpen,
  Cpu,
  Tag
} from 'lucide-react';
import { TopologyCostSummary, PricingTier } from '../types/topology';

interface HeaderProps {
  summary: TopologyCostSummary;
  pricingTier: PricingTier;
  onPricingTierChange: (tier: PricingTier) => void;
  onOpenTerraform: () => void;
  onOpenQuote: () => void;
  onOpenRateUpload: () => void;
  onOpenHowToUse: () => void;
  onOpenWebMCPGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  summary,
  pricingTier,
  onPricingTierChange,
  onOpenTerraform,
  onOpenQuote,
  onOpenRateUpload,
  onOpenHowToUse,
  onOpenWebMCPGuide,
}) => {
  return (
    <div className="flex flex-col border-b border-gray-800/80 bg-[#0B0F19]/95 backdrop-blur-lg z-20 select-none">
      {/* ROW 1: Brand Logo, Title, and Live FinOps KPI Metrics */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-gray-850">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-md shadow-blue-500/20 text-white font-bold">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-sm text-gray-100 tracking-tight flex items-center gap-1.5">
                CloudTopology <span className="text-blue-400 font-mono text-xs px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">CPQ</span>
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1" title="Connected to WebMCP Model Context (7 Tools Ready)">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                WebMCP Active (7 Tools)
              </span>
            </div>
            <p className="text-[10px] text-gray-400">Multi-Cloud FinOps, Latency & Egress Architecture CPQ</p>
          </div>
        </div>

        {/* Real-time FinOps KPI Metrics Bar */}
        <div className="hidden md:flex items-center gap-2">
          {/* Total Monthly Spend */}
          <div className="px-2.5 py-1 rounded-lg bg-gray-900/80 border border-gray-800 flex items-center gap-2">
            <div className="p-1 rounded bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[9px] text-gray-400 font-medium leading-none">Total Spend</div>
              <div className="text-xs font-mono font-bold text-gray-100 mt-0.5">
                ${summary.totalMonthlySpend.toLocaleString()}
                <span className="text-[9px] text-gray-400 font-normal">/mo</span>
              </div>
            </div>
          </div>

          {/* FinOps Savings */}
          <div className="px-2.5 py-1 rounded-lg bg-gray-900/80 border border-gray-800 flex items-center gap-2">
            <div className="p-1 rounded bg-blue-500/10 text-blue-400">
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[9px] text-gray-400 font-medium leading-none">Savings</div>
              <div className="text-xs font-mono font-bold text-blue-400 mt-0.5">
                ${summary.totalMonthlySavings.toLocaleString()}
                <span className="text-[9px] text-gray-400 font-normal">
                  {' '}({summary.onDemandBaseline > 0 ? Math.round((summary.totalMonthlySavings / summary.onDemandBaseline) * 100) : 0}%)
                </span>
              </div>
            </div>
          </div>

          {/* Egress Bandwidth Spend */}
          <div className="px-2.5 py-1 rounded-lg bg-gray-900/80 border border-gray-800 flex items-center gap-2">
            <div className={`p-1 rounded ${summary.egressSpend > 200 ? 'bg-amber-500/10 text-amber-400' : 'bg-gray-800 text-gray-400'}`}>
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[9px] text-gray-400 font-medium leading-none">Egress Bill</div>
              <div className="text-xs font-mono font-bold text-amber-400 mt-0.5">
                ${summary.egressSpend.toLocaleString()}
                <span className="text-[9px] text-gray-400 font-normal">/mo</span>
              </div>
            </div>
          </div>

          {/* Latency */}
          <div className="px-2.5 py-1 rounded-lg bg-gray-900/80 border border-gray-800 flex items-center gap-2">
            <div className="p-1 rounded bg-cyan-500/10 text-cyan-400">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[9px] text-gray-400 font-medium leading-none">p95 Latency</div>
              <div className="text-xs font-mono font-bold text-cyan-400 mt-0.5">
                {summary.p95LatencyMs}
                <span className="text-[9px] text-gray-400 font-normal"> ms</span>
              </div>
            </div>
          </div>

          {/* GDPR Compliance */}
          <div className={`px-2.5 py-1 rounded-lg border flex items-center gap-2 ${
            summary.violations.length > 0
              ? 'bg-amber-950/30 border-amber-500/30 text-amber-300'
              : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
          }`}>
            <ShieldAlert className="w-3.5 h-3.5" />
            <div>
              <div className="text-[9px] font-medium leading-none">GDPR Risk</div>
              <div className="text-xs font-mono font-bold mt-0.5">
                {summary.violations.length === 0 ? 'Compliant' : `${summary.violations.length} Alert${summary.violations.length > 1 ? 's' : ''}`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: FinOps Actions, Plan Selector & Interactive Guides */}
      <div className="h-11 px-4 flex items-center justify-between bg-gray-950/40 text-xs">
        {/* Left Side: FinOps Controls & Exports */}
        <div className="flex items-center gap-2">
          {/* Commitment Plan Switcher */}
          <div className="flex items-center gap-1 bg-gray-900 border border-gray-700/80 rounded-lg px-2 py-1">
            <Tag className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] text-gray-400 font-medium mr-1 hidden sm:inline">Plan:</span>
            <select
              value={pricingTier}
              onChange={(e) => onPricingTierChange(e.target.value as PricingTier)}
              aria-label="FinOps Commitment Plan"
              className="bg-transparent text-gray-100 text-xs font-mono focus:outline-none cursor-pointer"
            >
              <option value="on_demand" className="bg-gray-900">On-Demand (0% Baseline)</option>
              <option value="savings_plan_1yr" className="bg-gray-900">1-Yr Savings Plan (~35% off)</option>
              <option value="savings_plan_3yr" className="bg-gray-900">3-Yr Savings Plan (~55% off)</option>
              <option value="spot" className="bg-gray-900">Spot Instances (~65% off)</option>
            </select>
          </div>

          {/* Custom Rates Button */}
          <button
            onClick={onOpenRateUpload}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-700/80 text-gray-200 text-xs font-medium transition-all cursor-pointer shadow-sm"
            title="Upload Custom Enterprise Rate Sheet (JSON)"
          >
            <FileJson className="w-3.5 h-3.5 text-amber-400" />
            <span>Custom Rates</span>
          </button>

          {/* Generate Quote */}
          <button
            onClick={onOpenQuote}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-700/80 text-gray-200 text-xs font-medium transition-all cursor-pointer shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>CPQ Quote</span>
          </button>

          {/* Terraform Export */}
          <button
            onClick={onOpenTerraform}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-700/80 text-gray-200 text-xs font-medium transition-all cursor-pointer shadow-sm"
          >
            <FileCode className="w-3.5 h-3.5 text-indigo-400" />
            <span>Terraform</span>
          </button>
        </div>

        {/* Right Side: How to Use & WebMCP Guide Buttons */}
        <div className="flex items-center gap-2">
          {/* How to Use Tab Button */}
          <button
            onClick={onOpenHowToUse}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>How to Use</span>
          </button>

          {/* WebMCP Guide & Examples Tab Button */}
          <button
            onClick={onOpenWebMCPGuide}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>WebMCP Guide (7 Examples)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
