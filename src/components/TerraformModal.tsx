import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode } from 'lucide-react';

interface TerraformModalProps {
  hclCode: string;
  isOpen: boolean;
  onClose: () => void;
}

export const TerraformModal: React.FC<TerraformModalProps> = ({ hclCode, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(hclCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([hclCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'main.tf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0B0F19] border border-gray-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-100">Terraform / OpenTofu Infrastructure as Code</h2>
              <p className="text-[11px] text-gray-400 font-mono">main.tf (Auto-generated from visual topology)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 text-xs font-medium transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy HCL'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 text-xs font-medium transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .tf</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code Body */}
        <div className="p-4 overflow-y-auto bg-[#070A10] font-mono text-xs text-gray-300 select-text leading-relaxed">
          <pre className="whitespace-pre-wrap">{hclCode}</pre>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-800 bg-gray-950/60 flex items-center justify-between text-[11px] text-gray-500 font-mono">
          <span>Ready for `terraform init && terraform plan`</span>
          <span>OpenTofu 1.6+ & Terraform 1.5+ Compliant</span>
        </div>
      </div>
    </div>
  );
};
