import React, { useState } from 'react';
import { X, Upload, FileJson, Check, AlertTriangle } from 'lucide-react';
import { CustomRateSheet, parseCustomRateSheetJSON } from '../engine/rateCardParser';

interface RateUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRateSheet: (rateSheet: CustomRateSheet) => void;
}

const SAMPLE_RATE_CARD = `{
  "enterpriseName": "Acme Corp Global Enterprise Agreement (EA-2026)",
  "blanketDiscountPercent": 15.0,
  "customEgressRatePerGb": 0.045,
  "skuOverrides": [
    {
      "skuId": "aws-ec2-p5-48xlarge",
      "customMonthlyPrice": 22000.00
    },
    {
      "skuId": "gcp-gpu-h100-a3",
      "customMonthlyPrice": 21500.00
    },
    {
      "skuId": "aws-aurora-postgres",
      "customMonthlyPrice": 420.00
    }
  ]
}`;

export const RateUploadModal: React.FC<RateUploadModalProps> = ({
  isOpen,
  onClose,
  onApplyRateSheet,
}) => {
  const [jsonText, setJsonText] = useState(SAMPLE_RATE_CARD);
  const [parseError, setParseError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApply = () => {
    try {
      setParseError(null);
      const res = parseCustomRateSheetJSON(jsonText);
      if (!res.success || !res.data) {
        setParseError(res.error || 'Invalid JSON rate card.');
        return;
      }
      onApplyRateSheet(res.data);
      setSuccessMessage(`Successfully applied "${res.data.enterpriseName || 'Custom Rate Sheet'}"!`);
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1200);
    } catch (err: any) {
      setParseError(err.message || 'Invalid JSON rate card.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setJsonText(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="dark:bg-[#0F172A] bg-white border dark:border-gray-700 border-gray-300 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b dark:border-gray-800 border-gray-200 flex items-center justify-between dark:bg-gray-950/60 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl dark:bg-amber-500/10 bg-amber-50 text-amber-600 dark:text-amber-400 border dark:border-amber-500/20 border-amber-300">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold dark:text-gray-100 text-gray-900">
                Upload Custom Enterprise Rate Sheet (JSON)
              </h2>
              <p className="text-xs dark:text-gray-400 text-gray-500">
                Apply custom EDP / EDA negotiated contract rates, blanket discounts, and SKU pricing overrides
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg dark:bg-gray-800 bg-gray-100 hover:dark:bg-gray-700 hover:bg-gray-200 dark:text-gray-400 text-gray-600 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <label className="font-semibold dark:text-gray-300 text-gray-700">Enterprise Rate Card JSON Schema:</label>
            <label className="flex items-center gap-1.5 px-3 py-1 rounded-lg dark:bg-gray-800 bg-gray-100 hover:dark:bg-gray-700 hover:bg-gray-200 dark:text-gray-300 text-gray-700 border dark:border-gray-700 border-gray-300 cursor-pointer transition-all shadow-sm">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload JSON File</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            rows={12}
            className="w-full font-mono text-xs dark:bg-gray-950/80 bg-gray-50 border dark:border-gray-800 border-gray-300 rounded-xl p-3.5 dark:text-gray-200 text-gray-800 focus:outline-none focus:border-blue-500 shadow-sm"
          />

          {parseError && (
            <div className="p-3 rounded-xl dark:bg-rose-950/30 bg-rose-50 border dark:border-rose-500/30 border-rose-200 text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl dark:bg-emerald-950/30 bg-emerald-50 border dark:border-emerald-500/30 border-emerald-200 text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t dark:border-gray-800 border-gray-200 dark:bg-gray-950/80 bg-gray-50 flex items-center justify-between">
          <button
            onClick={() => setJsonText(SAMPLE_RATE_CARD)}
            className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Reset to Sample EDA
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl dark:bg-gray-800 bg-gray-200 hover:dark:bg-gray-700 hover:bg-gray-300 dark:text-gray-300 text-gray-800 font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all cursor-pointer shadow-md shadow-blue-500/20"
            >
              Apply Rates to Catalog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
