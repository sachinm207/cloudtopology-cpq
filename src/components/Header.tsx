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
  Tag,
  AlertCircle,
  Plus,
  Save,
  Sun,
  Moon
} from 'lucide-react';
import { TopologyCostSummary, PricingTier } from '../types/topology';

interface HeaderProps {
  summary: TopologyCostSummary;
  pricingTier: PricingTier;
  theme: 'dark' | 'light';
  onPricingTierChange: (tier: PricingTier) => void;
  onOpenTerraform: () => void;
  onOpenQuote: () => void;
  onOpenRateUpload: () => void;
  onOpenHowToUse: () => void;
  onOpenWebMCPGuide: () => void;
  onClearCanvas: () => void;
  onOpenSaveLoad: () => void;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  summary,
  pricingTier,
  theme,
  onPricingTierChange,
  onOpenTerraform,
  onOpenQuote,
  onOpenRateUpload,
  onOpenHowToUse,
  onOpenWebMCPGuide,
  onClearCanvas,
  onOpenSaveLoad,
  onToggleTheme,
}) => {
  return (
    <div className="flex flex-col border-b dark:border-gray-800/80 border-gray-200 dark:bg-[#0B0F19]/95 bg-white/95 backdrop-blur-lg z-20 select-none transition-colors duration-200">
      {/* TOP DISCLAIMER STRIP: Educational & Beta Status */}
      <div className="dark:bg-amber-950/30 bg-amber-50/80 border-b dark:border-amber-500/20 border-amber-200 px-4 py-1 text-[11px] dark:text-amber-300/90 text-amber-800 flex items-center justify-between font-mono">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="px-1.5 py-0.2 rounded dark:bg-amber-500/20 bg-amber-200/80 dark:text-amber-300 text-amber-900 font-bold text-[9px] border dark:border-amber-500/30 border-amber-300 flex items-center gap-1">
            <AlertCircle className="w-2.5 h-2.5" />
            EXPERIMENTAL BETA
          </span>
          <span className="truncate">
            🎓 For Educational & Architectural Simulation Purposes Only • Pre-Production Demonstration • Verify official rate cards before procurement.
          </span>
        </div>
        <span className="text-[10px] dark:text-amber-400/70 text-amber-700 hidden lg:inline">
          v1.0-beta • Open-Source WebMCP Demo
        </span>
      </div>

      {/* ROW 1: Brand Logo, Title, Live FinOps KPI Metrics, and Theme Toggle */}
      <div className="h-14 px-4 flex items-center justify-between border-b dark:border-gray-850 border-gray-200">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-md shadow-blue-500/20 text-white font-bold">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-sm dark:text-gray-100 text-gray-900 tracking-tight flex items-center gap-1.5">
                CloudTopology <span className="text-blue-600 dark:text-blue-400 font-mono text-xs px-1.5 py-0.5 rounded dark:bg-blue-500/10 bg-blue-50 border dark:border-blue-500/20 border-blue-200">CPQ</span>
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full dark:bg-emerald-500/10 bg-emerald-50 dark:text-emerald-400 text-emerald-700 border dark:border-emerald-500/20 border-emerald-200 flex items-center gap-1" title="Connected to WebMCP Model Context (8 Tools Ready)">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                WebMCP Active (8 Tools)
              </span>
            </div>
            <p className="text-[10px] dark:text-gray-400 text-gray-500">Multi-Cloud FinOps, Latency & Egress Architecture CPQ</p>
          </div>
        </div>

        {/* Real-time FinOps KPI Metrics Bar & Theme Switcher */}
        <div className="flex items-center gap-2">
          {/* Total Monthly Spend */}
          <div className="hidden md:flex px-2.5 py-1 rounded-lg dark:bg-gray-900/80 bg-gray-100 border dark:border-gray-800 border-gray-200 items-center gap-2">
            <div className="p-1 rounded dark:bg-emerald-500/10 bg-emerald-100 dark:text-emerald-400 text-emerald-700">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[9px] dark:text-gray-400 text-gray-500 font-medium leading-none">Total Spend</div>
              <div className="text-xs font-mono font-bold dark:text-gray-100 text-gray-900 mt-0.5">
                ${summary.totalMonthlySpend.toLocaleString()}
                <span className="text-[9px] dark:text-gray-400 text-gray-500 font-normal">/mo</span>
              </div>
            </div>
          </div>

          {/* FinOps Savings */}
          <div className="hidden md:flex px-2.5 py-1 rounded-lg dark:bg-gray-900/80 bg-gray-100 border dark:border-gray-800 border-gray-200 items-center gap-2">
            <div className="p-1 rounded dark:bg-blue-500/10 bg-blue-100 text-blue-600 dark:text-blue-400">
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[9px] dark:text-gray-400 text-gray-500 font-medium leading-none">Savings</div>
              <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                ${summary.totalMonthlySavings.toLocaleString()}
                <span className="text-[9px] dark:text-gray-400 text-gray-500 font-normal">
                  {' '}({summary.onDemandBaseline > 0 ? Math.round((summary.totalMonthlySavings / summary.onDemandBaseline) * 100) : 0}%)
                </span>
              </div>
            </div>
          </div>

          {/* Egress Bandwidth Spend */}
          <div className="hidden lg:flex px-2.5 py-1 rounded-lg dark:bg-gray-900/80 bg-gray-100 border dark:border-gray-800 border-gray-200 items-center gap-2">
            <div className={`p-1 rounded ${summary.egressSpend > 200 ? 'dark:bg-amber-500/10 bg-amber-100 text-amber-600 dark:text-amber-400' : 'dark:bg-gray-800 bg-gray-200 dark:text-gray-400 text-gray-600'}`}>
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[9px] dark:text-gray-400 text-gray-500 font-medium leading-none">Egress Bill</div>
              <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                ${summary.egressSpend.toLocaleString()}
                <span className="text-[9px] dark:text-gray-400 text-gray-500 font-normal">/mo</span>
              </div>
            </div>
          </div>

          {/* Latency */}
          <div className="hidden lg:flex px-2.5 py-1 rounded-lg dark:bg-gray-900/80 bg-gray-100 border dark:border-gray-800 border-gray-200 items-center gap-2">
            <div className="p-1 rounded dark:bg-cyan-500/10 bg-cyan-100 text-cyan-700 dark:text-cyan-400">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[9px] dark:text-gray-400 text-gray-500 font-medium leading-none">p95 Latency</div>
              <div className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400 mt-0.5">
                {summary.p95LatencyMs}
                <span className="text-[9px] dark:text-gray-400 text-gray-500 font-normal"> ms</span>
              </div>
            </div>
          </div>

          {/* GDPR Compliance */}
          <div className={`hidden sm:flex px-2.5 py-1 rounded-lg border items-center gap-2 ${
            summary.violations.length > 0
              ? 'dark:bg-amber-950/30 bg-amber-50 dark:border-amber-500/30 border-amber-300 dark:text-amber-300 text-amber-800'
              : 'dark:bg-emerald-950/30 bg-emerald-50 dark:border-emerald-500/30 border-emerald-300 dark:text-emerald-300 text-emerald-800'
          }`}>
            <ShieldAlert className="w-3.5 h-3.5" />
            <div>
              <div className="text-[9px] font-medium leading-none">GDPR Risk</div>
              <div className="text-xs font-mono font-bold mt-0.5">
                {summary.violations.length === 0 ? 'Compliant' : `${summary.violations.length} Alert${summary.violations.length > 1 ? 's' : ''}`}
              </div>
            </div>
          </div>

          {/* THEME TOGGLE BUTTON */}
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl dark:bg-gray-800/90 bg-gray-100 hover:dark:bg-gray-700 hover:bg-gray-200 border dark:border-gray-700 border-gray-300 dark:text-gray-200 text-gray-800 text-xs font-semibold transition-all cursor-pointer shadow-sm"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline text-xs">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline text-xs">Dark</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ROW 2: FinOps Actions, Plan Selector & Interactive Guides */}
      <div className="h-11 px-4 flex items-center justify-between dark:bg-gray-950/40 bg-gray-50/90 text-xs border-b dark:border-transparent border-gray-200">
        {/* Left Side: FinOps Controls & Exports */}
        <div className="flex items-center gap-2">
          {/* New / Clear Canvas Button */}
          <button
            onClick={onClearCanvas}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg dark:bg-blue-600/20 bg-blue-50 hover:dark:bg-blue-600/30 hover:bg-blue-100 border dark:border-blue-500/40 border-blue-300 text-blue-600 dark:text-blue-300 text-xs font-semibold transition-all cursor-pointer shadow-sm"
            title="Clear Canvas & Start Scratch"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Canvas</span>
          </button>

          {/* Save / Manage Architectures Button */}
          <button
            onClick={onOpenSaveLoad}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg dark:bg-emerald-600/20 bg-emerald-50 hover:dark:bg-emerald-600/30 hover:bg-emerald-100 border dark:border-emerald-500/40 border-emerald-300 text-emerald-700 dark:text-emerald-300 text-xs font-semibold transition-all cursor-pointer shadow-sm"
            title="Save, Export, or Load Architectures (JSON / Library)"
          >
            <Save className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Save / Load</span>
          </button>

          {/* Commitment Plan Switcher */}
          <div className="flex items-center gap-1 dark:bg-gray-900 bg-white border dark:border-gray-700/80 border-gray-300 rounded-lg px-2 py-1 shadow-sm">
            <Tag className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[10px] dark:text-gray-400 text-gray-500 font-medium mr-1 hidden sm:inline">Plan:</span>
            <select
              value={pricingTier}
              onChange={(e) => onPricingTierChange(e.target.value as PricingTier)}
              aria-label="FinOps Commitment Plan"
              className="bg-transparent dark:text-gray-100 text-gray-800 text-xs font-mono focus:outline-none cursor-pointer"
            >
              <option value="on_demand" className="dark:bg-gray-900 bg-white text-gray-900 dark:text-gray-100">On-Demand (0% Baseline)</option>
              <option value="savings_plan_1yr" className="dark:bg-gray-900 bg-white text-gray-900 dark:text-gray-100">1-Yr Savings Plan (~35% off)</option>
              <option value="savings_plan_3yr" className="dark:bg-gray-900 bg-white text-gray-900 dark:text-gray-100">3-Yr Savings Plan (~55% off)</option>
              <option value="spot" className="dark:bg-gray-900 bg-white text-gray-900 dark:text-gray-100">Spot Instances (~65% off)</option>
            </select>
          </div>

          {/* Custom Rates Button */}
          <button
            onClick={onOpenRateUpload}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg dark:bg-gray-900 bg-white hover:dark:bg-gray-800 hover:bg-gray-100 border dark:border-gray-700/80 border-gray-300 dark:text-gray-200 text-gray-800 text-xs font-medium transition-all cursor-pointer shadow-sm"
            title="Upload Custom Enterprise Rate Sheet (JSON)"
          >
            <FileJson className="w-3.5 h-3.5 text-amber-500" />
            <span>Custom Rates</span>
          </button>

          {/* Generate Quote */}
          <button
            onClick={onOpenQuote}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg dark:bg-gray-900 bg-white hover:dark:bg-gray-800 hover:bg-gray-100 border dark:border-gray-700/80 border-gray-300 dark:text-gray-200 text-gray-800 text-xs font-medium transition-all cursor-pointer shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>CPQ Quote</span>
          </button>

          {/* Terraform Export */}
          <button
            onClick={onOpenTerraform}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg dark:bg-gray-900 bg-white hover:dark:bg-gray-800 hover:bg-gray-100 border dark:border-gray-700/80 border-gray-300 dark:text-gray-200 text-gray-800 text-xs font-medium transition-all cursor-pointer shadow-sm"
          >
            <FileCode className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Terraform</span>
          </button>
        </div>

        {/* Right Side: How to Use & WebMCP Guide Buttons */}
        <div className="flex items-center gap-2">
          {/* How to Use Tab Button */}
          <button
            onClick={onOpenHowToUse}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg dark:bg-blue-600/20 bg-blue-50 hover:dark:bg-blue-600/30 hover:bg-blue-100 border dark:border-blue-500/40 border-blue-300 text-blue-600 dark:text-blue-300 text-xs font-semibold transition-all cursor-pointer shadow-sm"
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
            <span>WebMCP Guide (8 Examples)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
