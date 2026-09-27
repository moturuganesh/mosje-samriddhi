import React from 'react';
import { Award, Printer, X, FileText } from 'lucide-react';

export default function SanctionDocketModal({
  isOpen,
  onClose,
  formData,
  evaluationResult,
  emiResult
}) {
  if (!isOpen) return null;

  const scheme = evaluationResult?.primary_recommended_scheme;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-300 p-8 space-y-6">
        <div className="flex justify-between items-center border-b border-slate-200 pb-4 print:hidden">
          <div className="flex items-center space-x-2 text-slate-800 font-bold">
            <Award className="w-5 h-5 text-amber-600" />
            <span>Official MoSJE Channel Finance Sanction Readiness Docket</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-700 text-white text-base font-bold hover:bg-blue-800 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="border-4 border-slate-900 p-8 space-y-6 bg-white print:border-none print:p-0">
          <div className="text-center space-y-1 border-b-2 border-slate-900 pb-4">
            <span className="text-base font-black uppercase tracking-widest text-slate-800">
              GOVERNMENT OF INDIA • MINISTRY OF SOCIAL JUSTICE &amp; EMPOWERMENT
            </span>
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">
              TAMIL NADU ADI DRAVIDAR HOUSING &amp; DEV CORP (TAHDCO) • NSFDC
            </h1>
            <p className="text-base text-slate-600 font-medium">
              Statutory Concessional Credit Approval &amp; Channel Partner Allocation Docket (Tamil Nadu 2026)
            </p>
          </div>

          <div className="grid grid-cols-2 text-base border-b border-slate-200 pb-3">
            <div>
              <span className="text-slate-500 font-semibold">Application Tracking No:</span>
              <strong className="block text-slate-900 font-mono text-base">MOSJE-TAHDCO-2026-983421</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-500 font-semibold">Date of Evaluation:</span>
              <strong className="block text-slate-900 font-mono text-base">31 August 2026</strong>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-black uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-1">
              1. Verified Beneficiary Credentials (HITL Approved)
            </h3>
            <div className="grid grid-cols-3 gap-3 text-base">
              <div>
                <span className="text-slate-500 block">Applicant Name:</span>
                <strong className="text-slate-900 font-bold">{formData?.applicant_name || 'Priyadarshini M'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Social Category:</span>
                <strong className="text-slate-900 font-bold">{formData?.category || 'Scheduled Caste (SC)'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Annual Income:</span>
                <strong className="text-emerald-700 font-bold">Rs {formData?.annual_family_income?.toLocaleString('en-IN') || '1,80,000'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Certificate Reg ID:</span>
                <strong className="text-slate-900 font-mono">{formData?.certificate_number || 'TN/CGL/2026/INC-98231'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">District &amp; State:</span>
                <strong className="text-slate-900">{formData?.district || 'Chengalpattu'}, {formData?.state || 'Tamil Nadu'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Proposed Activity:</span>
                <strong className="text-slate-900">{formData?.purpose || 'Tailoring & Garment Unit'}</strong>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-black uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-1">
              2. Approved NSFDC Scheme &amp; Financial Structure
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-base">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Scheme Name</span>
                <strong className="text-slate-900 font-bold">{scheme?.scheme_name || 'Mahila Samriddhi Yojana (MSY)'}</strong>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Interest Rate</span>
                <strong className="text-emerald-700 font-black text-base">{scheme?.interest_rate_pct || 4.0}% p.a.</strong>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Loan Assistance (90%)</span>
                <strong className="text-blue-700 font-black text-base">Rs {scheme?.loan_amount?.toLocaleString('en-IN') || '90,000'}</strong>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Promoter Share (10%)</span>
                <strong className="text-slate-900 font-bold">Rs {scheme?.promoter_contribution_amount?.toLocaleString('en-IN') || '10,000'}</strong>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-black uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-1">
              3. Moratorium Gestation &amp; Repayment Terms
            </h3>
            <div className="grid grid-cols-3 gap-3 text-base bg-amber-50/60 p-3 rounded border border-amber-200">
              <div>
                <span className="text-amber-900 font-semibold block">Approved Moratorium:</span>
                <strong className="text-slate-900">{emiResult?.moratorium_months || 3} Months (Zero EMI)</strong>
              </div>
              <div>
                <span className="text-amber-900 font-semibold block">Capitalized Principal:</span>
                <strong className="text-slate-900">Rs {emiResult?.capitalized_principal?.toLocaleString('en-IN') || '91,815'}</strong>
              </div>
              <div>
                <span className="text-amber-900 font-semibold block">Monthly Reducing EMI:</span>
                <strong className="text-emerald-800 font-black text-base">Rs {emiResult?.monthly_emi_post_moratorium?.toLocaleString('en-IN') || '3,221'} / mo</strong>
              </div>
            </div>
          </div>

          <div className="pt-8 flex justify-between items-end text-base border-t border-slate-300">
            <div className="text-center space-y-1">
              <div className="w-32 h-12 border-b-2 border-slate-400 mx-auto"></div>
              <span className="text-slate-600 font-medium block">Beneficiary Signature / Thumb</span>
            </div>

            <div className="text-center space-y-1">
              <div className="w-36 h-12 border-b-2 border-slate-400 mx-auto flex items-center justify-center text-[10px] text-slate-400 font-mono">
                [QR / Digital Sign Verified]
              </div>
              <span className="text-slate-600 font-bold block">Authorized Channel Partner (SCA)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
