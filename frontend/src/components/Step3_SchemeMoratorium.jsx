import React, { useState, useEffect } from 'react';
import { Calculator, ArrowLeft, ArrowRight, Info, TrendingUp, AlertCircle, Table, Loader2 } from 'lucide-react';
import { calculateEMI } from '../api';

export default function Step3_SchemeMoratorium({ evaluationResult, onComplete, onBack }) {
  const [loanAmount, setLoanAmount] = useState(150000);
  const [moratoriumMonths, setMoratoriumMonths] = useState(3);
  const [emiResult, setEmiResult] = useState(null);
  const [showAmortization, setShowAmortization] = useState(false);
  const [calculating, setCalculating] = useState(false);

  const selectedScheme = evaluationResult?.primary_recommended_scheme;

  useEffect(() => {
    if (selectedScheme) {
      setLoanAmount(Math.min(selectedScheme.max_loan_limit, 500000));
    }
  }, [selectedScheme]);

  useEffect(() => {
    if (selectedScheme && loanAmount >= 10000 && loanAmount <= selectedScheme.max_loan_limit) {
      const calculate = async () => {
        setCalculating(true);
        try {
          const data = await calculateEMI({
            loan_amount: loanAmount,
            annual_interest_rate_pct: selectedScheme.interest_rate_pct || 5.0,
            tenure_months: selectedScheme.recommended_tenure_months || 60,
            moratorium_months: moratoriumMonths,
            compounding_frequency: 'monthly'
          });
          data.selected_scheme_data = selectedScheme;
          setEmiResult(data);
        } catch (err) {
          console.error(err);
        } finally {
          setCalculating(false);
        }
      };
      const timerId = setTimeout(() => calculate(), 400);
      return () => clearTimeout(timerId);
    }
  }, [loanAmount, moratoriumMonths, selectedScheme]);

  const handleCalculate = async () => {
    if (!selectedScheme) return;
    setCalculating(true);
    try {
      const data = await calculateEMI({
        loan_amount: loanAmount,
        annual_interest_rate_pct: selectedScheme.interest_rate_pct || 5.0,
        tenure_months: selectedScheme.recommended_tenure_months || 60,
        moratorium_months: moratoriumMonths,
        compounding_frequency: 'monthly'
      });
      data.selected_scheme_data = selectedScheme;
      setEmiResult(data);
    } catch (err) {
      console.error(err);
      alert('Error calculating EMI.');
    } finally {
      setCalculating(false);
    }
  };

  if (!selectedScheme) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 text-center border border-slate-200">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800">No Scheme Selected</h2>
        <button onClick={onBack} className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
      
      {/* Official Header */}
      <div className="bg-primary p-6 sm:p-8 flex items-start gap-4 text-white">
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
          <Calculator className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px] uppercase tracking-widest border border-blue-500/30 mb-2">
            Step 4 of 5 • Financial Structuring
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">EMI & Moratorium Simulator</h2>
          <p className="text-slate-400 text-base mt-2 max-w-2xl">
            Configure your required loan amount and gestation (grace) period. Our financial engine accurately models capitalized interest under MoSJE regulations.
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        
        {/* Selected Scheme Badge */}
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl mb-8 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <p className="text-[10px] uppercase font-black tracking-widest text-emerald-600 mb-1">Approved Scheme Profile</p>
            <h3 className="text-lg font-black text-primary">{selectedScheme.scheme_name}</h3>
            <p className="text-base text-slate-500 font-medium">Interest Rate: <span className="font-bold text-emerald-700">{selectedScheme.interest_rate_pct}% p.a.</span> (Fixed)</p>
          </div>
          <div className="text-right">
            <p className="text-base text-slate-500 font-medium uppercase tracking-wider mb-1">Maximum Statutory Limit</p>
            <p className="text-xl font-black text-primary">₹{(selectedScheme.max_loan_limit).toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Configuration Controls */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-base font-bold text-slate-700 uppercase tracking-wider">Required Loan Amount (₹)</label>
              <span className="text-base font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                Min: ₹10,000
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max={selectedScheme.max_loan_limit}
              step="5000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0f172a]"
            />
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-4 rounded-xl text-lg font-bold border-2 border-slate-300 text-lg font-black text-primary bg-slate-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-base font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                Moratorium Period
                <span title="Grace period where no EMI is paid, but interest capitalizes" className="cursor-help text-slate-400"><Info className="w-4 h-4"/></span>
              </label>
              <span className="text-base font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                {moratoriumMonths} Months
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              step="1"
              value={moratoriumMonths}
              onChange={(e) => setMoratoriumMonths(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
              <span>0M (Immediate)</span>
              <span>3M (Standard)</span>
              <span>6M (Max)</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
           <button
            onClick={handleCalculate}
            disabled={calculating || loanAmount < 10000 || loanAmount > selectedScheme.max_loan_limit}
            className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-primary rounded-xl font-black text-base shadow-xl shadow-amber-500/20 transition-all disabled:opacity-50"
          >
            {calculating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calculator className="w-5 h-5" />}
            Refresh Schedule
          </button>
        </div>

        {/* RESULTS SECTION */}
        {emiResult && (
          <div className="bg-primary rounded-2xl p-6 md:p-8 shadow-xl text-white">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              
              <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700">
                <span className="text-base text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2 mb-2">
                  Capitalized Principal
                </span>
                <span className="text-3xl font-black text-amber-400">
                  ₹{emiResult.capitalized_principal?.toLocaleString('en-IN')}
                </span>
                <div className="mt-2 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex justify-between">
                    <span>Base Loan:</span> <span>₹{emiResult.original_principal?.toLocaleString('en-IN')}</span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex justify-between">
                    <span>Grace Interest:</span> <span>+₹{emiResult.interest_accrued_during_moratorium?.toLocaleString('en-IN')}</span>
                  </span>
                </div>
              </div>

              <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3">
                  <TrendingUp className="w-12 h-12 text-emerald-500/20" />
                </div>
                <span className="text-base text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2 mb-2 relative z-10">
                  Post-Moratorium EMI
                </span>
                <span className="text-3xl font-black text-emerald-400 relative z-10">
                  ₹{emiResult.monthly_emi_post_moratorium?.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-2 block relative z-10">
                  Fixed for {emiResult.repayment_months} Months
                </span>
              </div>

              <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700">
                <span className="text-base text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2 mb-2">
                  Total Cost of Credit
                </span>
                <span className="text-3xl font-black text-white">
                  ₹{emiResult.total_amount_paid?.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 block">
                  Total Interest Paid: ₹{emiResult.total_interest_paid?.toLocaleString('en-IN')}
                </span>
              </div>

            </div>

            <div className="flex justify-center border-t border-slate-700 pt-6">
              <button
                onClick={() => setShowAmortization(!showAmortization)}
                className="text-base text-amber-400 hover:text-amber-300 font-bold flex items-center gap-2 uppercase tracking-widest transition-colors"
              >
                <Table className="w-4 h-4" />
                <span>{showAmortization ? 'Hide Full Amortization Schedule' : 'View Month-by-Month Amortization Schedule'}</span>
              </button>
            </div>

            {showAmortization && emiResult?.amortization_schedule && (
              <div className="mt-6 max-h-[300px] overflow-y-auto rounded-xl border border-slate-700 bg-primary">
                <table className="w-full text-left text-base text-slate-300">
                  <thead className="bg-slate-800 text-slate-400 font-black uppercase text-[10px] tracking-wider sticky top-0 z-10">
                    <tr>
                      <th className="p-3">Month</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Opening (₹)</th>
                      <th className="p-3 text-right">Interest (₹)</th>
                      <th className="p-3 text-right">Principal (₹)</th>
                      <th className="p-3 text-right text-emerald-400">Installment (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 font-medium">
                    {emiResult.amortization_schedule.map((row) => (
                      <tr key={row.month} className={row.is_moratorium ? 'bg-amber-950/20' : 'hover:bg-slate-800/50 transition-colors'}>
                        <td className="p-3">M{row.month}</td>
                        <td className="p-3">
                          {row.is_moratorium ? (
                            <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 text-[9px] font-bold uppercase tracking-widest">
                              Moratorium
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-widest">
                              Repayment
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">₹{row.opening_balance?.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right text-rose-300">₹{row.interest_accrued?.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right text-emerald-300">₹{row.principal_paid?.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right font-black text-white">₹{row.total_installment?.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
      
      {/* Footer Actions */}
      <div className="bg-[#f8fafc] p-6 sm:p-8 flex justify-between items-center border-t border-slate-200">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-base transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        
        <button
          onClick={() => {
            if (emiResult) onComplete(emiResult);
          }}
          disabled={!emiResult}
          className="flex items-center space-x-3 px-8 py-4 rounded-xl bg-primary hover:bg-blue-900 text-white font-black text-base shadow-xl shadow-slate-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Confirm Schedule & Route to Branch</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

