import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileJson, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Percent
} from 'lucide-react';
import { 
  parseCustomRateSheetJSON, 
  generateSampleRateSheetTemplate, 
  CustomRateSheet 
} from '../engine/rateCardParser';

interface RateUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRateSheet: (rateSheet: CustomRateSheet) => void;
}

export const RateUploadModal: React.FC<RateUploadModalProps> = ({
  isOpen,
  onClose,
  onApplyRateSheet,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [parsedData, setParsedData] = useState<CustomRateSheet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [quickBlanketPercent, setQuickBlanketPercent] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonText(content);
      validateJSON(content);
    };
    reader.readAsText(file);
  };

  const validateJSON = (text: string) => {
    setError(null);
    setSuccessMessage(null);
    if (!text.trim()) {
      setParsedData(null);
      return;
    }

    const result = parseCustomRateSheetJSON(text);
    if (result.success && result.data) {
      setParsedData(result.data);
      setSuccessMessage(`Valid Rate Card: ${result.data.enterpriseName} (${result.data.skuOverrides?.length || 0} SKU overrides, ${result.data.blanketDiscountPercent}% blanket EDA).`);
    } else {
      setParsedData(null);
      setError(result.error || 'Invalid JSON syntax.');
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setJsonText(text);
    validateJSON(text);
  };

  const handleDownloadTemplate = () => {
    const templateStr = generateSampleRateSheetTemplate();
    const blob = new Blob([templateStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'custom_enterprise_rates_template.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleApply = () => {
    if (parsedData) {
      onApplyRateSheet(parsedData);
      onClose();
    } else if (quickBlanketPercent > 0) {
      onApplyRateSheet({
        version: '1.0',
        enterpriseName: `Custom ${quickBlanketPercent}% Blanket EDA`,
        blanketDiscountPercent: quickBlanketPercent,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#0B0F19] border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-gray-100">Upload Enterprise Rate Card</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Feature Beta
                </span>
              </div>
              <p className="text-xs text-gray-400">Load negotiated Enterprise Discount Agreements (EDAs) or custom rate cards</p>
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
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Privacy & Air-Gap Badge */}
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 flex items-center gap-2.5 text-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="font-semibold block">100% Client-Side Privacy Guarantee</span>
              <span className="text-[11px] text-emerald-400/80">Your rate card is parsed exclusively in your browser's RAM memory. Zero data is transmitted to external servers.</span>
            </div>
          </div>

          {/* Quick Blanket EDA Option */}
          <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-gray-200">
              <span className="flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-blue-400" />
                Quick Blanket Enterprise Discount (EDA)
              </span>
              <span className="font-mono text-blue-400 font-bold">{quickBlanketPercent}% Off</span>
            </div>
            <p className="text-[11px] text-gray-400">Apply a blanket corporate discount across all compute and database SKUs without uploading a file.</p>
            <input
              type="range"
              min={0}
              max={50}
              step={0.5}
              value={quickBlanketPercent}
              onChange={(e) => setQuickBlanketPercent(parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Upload File Zone */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-300">Upload JSON Rate Sheet</label>
              <button
                onClick={handleDownloadTemplate}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" />
                Download JSON Template
              </button>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="p-4 rounded-xl border-2 border-dashed border-gray-700 hover:border-blue-500 bg-gray-900/30 text-center cursor-pointer transition-all hover:bg-gray-900/50"
            >
              <Upload className="w-6 h-6 mx-auto mb-1.5 text-gray-400" />
              <p className="text-xs font-medium text-gray-200">Click to browse or drop .json rate sheet here</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Supports custom SKU hourly prices, 1-Yr/3-Yr discounts, and custom egress rates</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* JSON Text Editor / Preview */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Or Paste JSON Content Directly:</label>
            <textarea
              rows={6}
              value={jsonText}
              onChange={handleTextChange}
              placeholder={`{\n  "version": "1.0",\n  "enterpriseName": "Acme Corp Private EDA",\n  "blanketDiscountPercent": 14.5\n}`}
              className="w-full bg-gray-950 font-mono text-xs text-gray-200 p-3 rounded-xl border border-gray-800 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Status Feedback */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800 bg-gray-950/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!parsedData && quickBlanketPercent === 0}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 shadow-lg shadow-blue-600/30"
          >
            <CheckCircle2 className="w-4 h-4" />
            Apply Custom Rates to Canvas
          </button>
        </div>
      </div>
    </div>
  );
};
