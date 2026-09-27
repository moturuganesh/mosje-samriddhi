import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, ShieldCheck, CheckCircle2, FileText, Landmark, ArrowRight, ArrowLeft } from 'lucide-react';

export default function SchemeExplorer({ evaluationResult, onSelectScheme }) {
  const [expandedId, setExpandedId] = useState(null);

  const eligibleSchemes = evaluationResult?.all_eligible_schemes || [];

  if (eligibleSchemes.length === 0) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 p-8 md:p-12 text-center space-y-6">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto border border-rose-100">
          <AlertTriangle className="w-10 h-10 text-rose-500" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#0f172a]">No Eligible Schemes Found</h2>
          <p className="text-base text-slate-500 mt-2 max-w-lg mx-auto leading-relaxed">
            Based on your strictly verified demographic parameters and proposed project cost, we could not find any active MoSJE/NSFDC schemes that match.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
      
      {/* Official Header */}
      <div className="bg-[#0f172a] p-6 sm:p-8 flex items-start gap-4 text-white">
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
          <Landmark className="w-6 h-6 text-blue-400" />
        </div>
        <div className="flex-1 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px] uppercase tracking-widest border border-blue-500/30 mb-2">
              Step 3 of 4 • Scheme Evaluation
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">Eligible Loan Schemes</h2>
            <p className="text-slate-400 text-base mt-2 max-w-2xl">
              We deterministically filtered the official Government of India database. You strictly qualify for the following {eligibleSchemes.length} schemes.
            </p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 flex items-center gap-3 shrink-0">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <div>
              <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Matches Found</p>
              <p className="text-white text-base font-black">{eligibleSchemes.length} Schemes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 bg-[#f8fafc]">
        <div className="space-y-6">
          {eligibleSchemes.map((scheme, idx) => {
            const isExpanded = expandedId === scheme.scheme_id;
            return (
              <div key={scheme.scheme_id} className={`bg-white border-2 ${idx === 0 ? 'border-amber-400 shadow-lg shadow-amber-500/10' : 'border-slate-200 shadow-sm'} rounded-2xl overflow-hidden transition-all duration-300`}>
                
                {/* Header (Always Visible) */}
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : scheme.scheme_id)}
                  className={`p-6 cursor-pointer hover:bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isExpanded ? 'border-b border-slate-100' : ''}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1.5">
                      <h3 className="font-black text-[#0f172a] text-lg sm:text-xl">{scheme.scheme_name}</h3>
                      {idx === 0 && (
                        <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest border border-amber-200">
                          Top Recommendation
                        </span>
                      )}
                    </div>
                    <p className="text-base text-slate-500 font-bold tracking-wide uppercase">{scheme.ministry} • {scheme.corporation}</p>
                  </div>

                  <div className="flex items-center gap-6 w-full md:w-auto bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-xl border border-slate-200 md:border-none">
                    <div className="text-right flex-1 md:flex-none">
                      <div className="text-lg font-black text-emerald-600">{scheme.interest_rate_pct}% p.a.</div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Interest Rate</div>
                    </div>
                    <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
                    <div className="text-right flex-1 md:flex-none">
                      <div className="text-lg font-black text-[#0f172a]">₹{(scheme.max_loan_limit / 100000).toFixed(1)}L</div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Max Limit</div>
                    </div>
                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Deep Detail Body */}
                {isExpanded && (
                  <div className="p-6 md:p-8 bg-white animate-in slide-in-from-top-2 duration-300">
                    <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-xl mb-8">
                      <p className="text-base text-[#0f172a] font-medium leading-relaxed">{scheme.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       
                       {/* Eligibility & Validation */}
                       <div className="space-y-6">
                          <div>
                            <h4 className="flex items-center gap-2 text-base font-black text-slate-400 uppercase tracking-widest mb-4">
                              <ShieldCheck className="w-4 h-4 text-emerald-500" />
                              Official Criteria
                            </h4>
                            <ul className="space-y-3">
                              {scheme.eligibility_criteria?.map((crit, i) => (
                                <li key={i} className="flex items-start gap-3 text-base font-medium text-slate-700">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                  <span>{crit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                             <h5 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-2">Why you matched:</h5>
                             <div className="space-y-2">
                               {scheme.key_benefits.map((reason, i) => (
                                 <div key={i} className="text-base font-bold text-emerald-800 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> {reason}
                                 </div>
                               ))}
                             </div>
                          </div>
                       </div>

                       {/* Financials & Documents */}
                       <div className="space-y-6">
                          <div>
                            <h4 className="flex items-center gap-2 text-base font-black text-slate-400 uppercase tracking-widest mb-3">
                              <Landmark className="w-4 h-4 text-blue-500" />
                              Financial Assistance
                            </h4>
                            <p className="text-base font-medium text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                              {scheme.financial_assistance}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="flex items-center gap-2 text-base font-black text-slate-400 uppercase tracking-widest mb-3">
                              <FileText className="w-4 h-4 text-amber-500" />
                              Documents Required
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {scheme.documents_required?.map((doc, i) => (
                                <span key={i} className="px-4 py-2 bg-white text-[#0f172a] text-sm font-bold rounded-xl border border-slate-200 shadow-sm">
                                  {doc}
                                </span>
                              ))}
                            </div>
                          </div>
                       </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onSelectScheme(scheme); }}
                        className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#0f172a] hover:bg-blue-900 text-white font-black text-base shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-0.5"
                      >
                        <span>Select Scheme & Setup EMI</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
