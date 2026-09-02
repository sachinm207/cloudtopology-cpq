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
      title: 'Export Production Terraform & Executive CPQ Quotes',
      description: 'Click "CPQ Quote" to generate a formal PDF invoice document, or click "Terraform" to export copy-pasteable HCL 2.0 infrastructure-as-code for immediate deployment.',
      badge: 'Export Tools',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#0B0F19] border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-100">How to Use CloudTopology CPQ</h2>
              <p className="text-xs text-gray-400">Step-by-step visual architecting and FinOps cost optimization guide</p>
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
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <div 
                  key={s.step}
                  className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 hover:border-blue-500/40 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 font-mono text-xs font-bold flex items-center justify-center border border-blue-500/30">
                        {s.step}
                      </span>
                      <Icon className="w-4 h-4 text-gray-300" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                      {s.badge}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-gray-100">{s.title}</h3>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{s.description}</p>
                </div>
              );
            })}
          </div>

          {/* Quick Tips Box */}
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
            <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              FinOps Pro-Tips:
            </h4>
            <ul className="text-[11px] text-gray-300 space-y-1 list-disc list-inside">
              <li><strong className="text-indigo-200">Zero-Egress Caching:</strong> Connect a Cloudflare Edge node to AWS/GCP resources to automatically eliminate public data transfer bills.</li>
              <li><strong className="text-indigo-200">GDPR Compliance:</strong> Check the "Audits" tab in the sidebar if you transfer PII customer data outside the EU.</li>
              <li><strong className="text-indigo-200">Stateful Safety:</strong> Databases and storage automatically block Spot instances to prevent accidental data loss.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-800 bg-gray-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer shadow-lg shadow-blue-600/20"
          >
            Got It, Let's Build!
          </button>
        </div>
      </div>
    </div>
  );
};
