import React from 'react';
import { 
  X, 
  BookOpen, 
  Layers, 
  PlusCircle, 
  Sliders, 
  FileText, 
  Zap,
  ShieldCheck,
  Tag
} from 'lucide-react';

interface HowToUseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToUseModal: React.FC<HowToUseModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: '1',
      icon: Layers,
      title: 'Load a Pre-Built Architecture or Start from Scratch',
      description: 'Click the "Presets" tab in the left sidebar to load enterprise architectures (Global E-Commerce, AI Inference Cluster, GDPR FinTech Core) with 1 click.',
      badge: 'Presets Tab',
    },
    {
      step: '2',
      icon: PlusCircle,
      title: 'Add Nodes across AWS, GCP, Azure & Cloudflare',
      description: 'Click "Add Node" to choose a cloud provider, service category (Compute, Database, Storage, CDN), and drop SKUs directly onto the 2D canvas.',
      badge: 'Add Node Tab',
    },
    {
      step: '3',
      icon: Zap,
      title: 'Connect Handles to Route Traffic & Model Egress',
      description: 'Drag blue handles between nodes to create network links. The animated edge instantly computes monthly data transfer (GB/TB), $/mo egress fees, and speed-of-light fiber latency (ms).',
      badge: 'Interactive Canvas',
    },
    {
      step: '4',
      icon: Sliders,
      title: 'Inspect & Configure Node Parameters',
      description: 'Click any node on the canvas to open the "Inspect" panel. Adjust instance counts (1–32 pods), storage capacity (GB/TB), cloud region, or toggle GDPR PII flags.',
      badge: 'Inspect Tab',
    },
    {
      step: '5',
      icon: Tag,
      title: 'Simulate Commitment Plans & Custom Rates',
      description: 'Use the plan dropdown in the top toolbar to switch between On-Demand, 1-Yr Savings Plan (~35% off), 3-Yr Savings Plan (~55% off), or Spot instances. Upload custom enterprise rate cards via "Custom Rates".',
      badge: 'FinOps Bar',
    },
    {
      step: '6',
      icon: FileText,
      title: 'Export CPQ Quotes & Terraform Code',
      description: 'Click "CPQ Quote" to generate an executive procurement document with ACV/TCV breakdown, or click "Terraform" to export deployable Terraform HCL 2.0 files.',
      badge: 'Exports',
    },
    {
      step: '7',
      icon: ShieldCheck,
      title: 'Real-Time Audits & GDPR Data Residency',
      description: 'The real-time compliance engine detects EU PII data residency violations, unencrypted cross-cloud links, and excessive egress cost spikes automatically.',
      badge: 'Audits Tab',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="dark:bg-[#0D121F] bg-white border dark:border-gray-800 border-gray-300 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b dark:border-gray-800 border-gray-200 flex items-center justify-between dark:bg-gray-950/60 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl dark:bg-blue-600/20 bg-blue-100 text-blue-600 dark:text-blue-400 border dark:border-blue-500/30 border-blue-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold dark:text-gray-100 text-gray-900">
                How to Use CloudTopology CPQ
              </h2>
              <p className="text-xs dark:text-gray-400 text-gray-500">
                Step-by-step visual guide to designing multi-cloud architectures, calculating FinOps spend, and exporting IaC
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="p-4 rounded-xl dark:bg-gray-900/40 bg-gray-50 border dark:border-gray-800/80 border-gray-200 flex items-start gap-4 hover:dark:border-blue-500/30 hover:border-blue-300 transition-all shadow-sm"
              >
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-mono font-bold text-xs shadow-md shadow-blue-500/20">
                  {item.step}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-bold text-xs dark:text-gray-200 text-gray-900 flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded dark:bg-blue-500/10 bg-blue-100 text-blue-700 dark:text-blue-300 border dark:border-blue-500/20 border-blue-200 flex-shrink-0">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[11px] dark:text-gray-400 text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t dark:border-gray-800 border-gray-200 dark:bg-gray-950/80 bg-gray-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all cursor-pointer shadow-md shadow-blue-500/20"
          >
            Got it, Let's Build!
          </button>
        </div>
      </div>
    </div>
  );
};
