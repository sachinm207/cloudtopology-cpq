import React, { useState } from 'react';
import { X, Copy, Check, FileCode, Download } from 'lucide-react';

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
    const element = document.createElement('a');
    const file = new Blob([hclCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'main.tf';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="dark:bg-[#0F172A] bg-white border dark:border-gray-700 border-gray-300 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b dark:border-gray-800 border-gray-200 flex items-center justify-between dark:bg-gray-950/60 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl dark:bg-indigo-500/10 bg-indigo-50 text-indigo-600 dark:text-indigo-400 border dark:border-indigo-500/20 border-indigo-200">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold dark:text-gray-100 text-gray-900">
                Production-Ready Terraform HCL (v2.0)
              </h2>
              <p className="text-xs dark:text-gray-400 text-gray-500">
                Synthesized Multi-Cloud Infrastructure as Code from active topology
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg dark:bg-gray-800 bg-gray-100 hover:dark:bg-gray-700 hover:bg-gray-200 dark:text-gray-200 text-gray-800 border dark:border-gray-700 border-gray-300 text-xs font-semibold transition-all cursor-pointer shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .tf</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg dark:bg-gray-800 bg-gray-100 hover:dark:bg-gray-700 hover:bg-gray-200 dark:text-gray-400 text-gray-600 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 dark:bg-[#070A10] bg-gray-900 text-gray-200 font-mono text-xs">
          <pre className="whitespace-pre-wrap leading-relaxed">
            {hclCode}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t dark:border-gray-800 border-gray-200 dark:bg-gray-950/80 bg-gray-50 flex items-center justify-between text-xs dark:text-gray-400 text-gray-600">
          <span>Ready for `terraform init && terraform apply` execution.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl dark:bg-gray-800 bg-gray-200 hover:dark:bg-gray-700 hover:bg-gray-300 dark:text-gray-200 text-gray-800 font-semibold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
