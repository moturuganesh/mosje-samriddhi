import React, { useState } from 'react';
import { UploadCloud, Sparkles, Zap, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { extractDocument, mockExtractDocument } from '../api';

export default function Step1_Ingestion({ onComplete, isVoiceActive, speakText }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setError(null);
    }
  };

  const handleRealOCR = async () => {
    if (!file) {
      setError('Please select an Indian Income or Caste Certificate image first.');
      return;
    }
    setLoading(true);
    setError(null);
    if (isVoiceActive && speakText) speakText('Analyzing certificate image using multimodal vision intelligence.');
    try {
      const data = await extractDocument(file);
      onComplete(data);
      if (isVoiceActive && speakText) speakText(`Certificate extracted successfully for ${data.applicant_name || 'beneficiary'}.`);
    } catch (err) {
      console.error(err);
      setError('OCR extraction encountered an issue. You can use the ⚡ Load Demo Sample button.');
    } finally {
      setLoading(false);
    }
  };

  const handleMockSample = async () => {
    setLoading(true);
    setError(null);
    if (isVoiceActive && speakText) speakText('Loading official sample certificate for instant verification.');
    try {
      const data = await mockExtractDocument();
      onComplete(data);
      if (isVoiceActive && speakText) speakText(`Sample loaded for ${data.applicant_name}, category ${data.category}, annual income 1 lakh 80 thousand rupees.`);
    } catch (err) {
      console.error(err);
      setError('Unable to load demo sample.');
    } finally {
      setLoading(false);
    }
  };  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
      
      {/* Official Header */}
      <div className="bg-[#0f172a] p-6 sm:p-8 flex items-start gap-4 text-white">
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
          <UploadCloud className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px] uppercase tracking-widest border border-blue-500/30 mb-2">
            Step 1 of 4 • Digital KYC
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">Document Ingestion & Verification</h2>
          <p className="text-slate-400 text-base mt-2 max-w-2xl">
            Upload your official Caste/Community or Income Certificate. Our secure Human-in-the-Loop OCR engine extracts your demographic parameters for deterministic scheme matching.
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          
          <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-blue-200 hover:border-blue-500 rounded-3xl p-10 bg-blue-50/50 hover:bg-blue-50 cursor-pointer transition-all group overflow-hidden">
            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            {previewUrl ? (
              <div className="space-y-4 text-center z-10">
                {(file?.type?.includes('pdf') || file?.name?.toLowerCase().endsWith('.pdf')) ? (
                  <div className="flex flex-col items-center justify-center h-48 w-full bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded font-black text-[10px] uppercase tracking-widest border border-rose-200">Official PDF Loaded</span>
                    <p className="mt-3 font-bold text-slate-700 text-base truncate max-w-xs">{file?.name}</p>
                  </div>
                ) : (
                  <img
                    src={previewUrl}
                    alt="Certificate Preview"
                    className="max-h-48 rounded-xl shadow-md border border-slate-200 mx-auto object-contain bg-white"
                  />
                )}
                <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 inline-block text-base font-bold text-blue-700 hover:text-blue-900">
                  Select a different document
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4 text-center z-10">
                <div className="w-20 h-20 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:text-amber-500 transition-all duration-300">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-base font-black text-[#0f172a]">Click to Upload Document</p>
                  <p className="text-base font-medium text-slate-500 mt-1">Supports highly legible JPG, PNG, or scanned PDFs</p>
                </div>
              </div>
            )}
            
            {/* Decorative background circle */}
            <div className="absolute w-[800px] h-[800px] bg-white opacity-40 rounded-full top-full left-1/2 -translate-x-1/2 -translate-y-[20%] group-hover:-translate-y-[30%] transition-transform duration-700 ease-out z-0"></div>
          </label>

          {error && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <p className="text-rose-700 text-base font-semibold">{error}</p>
            </div>
          )}

          <div className='flex flex-col sm:flex-row gap-4 pt-4'>
            <button
              onClick={handleRealOCR}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-[#0f172a] hover:bg-blue-900 disabled:bg-slate-300 text-white font-black text-base shadow-xl shadow-slate-200 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Extracting Securely...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <span>Extract & Verify Document</span>
                </>
              )}
            </button>

            <button
              onClick={handleMockSample}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 text-[#0f172a] font-black text-base shadow-sm transition-all"
            >
              <Zap className="w-5 h-5 text-amber-500" />
              <span>Load Approved Sample</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <p className="text-base font-bold text-slate-500 uppercase tracking-widest">
              Zero Data Retention • AES-256 Encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}