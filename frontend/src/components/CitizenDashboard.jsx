import React, { useState, useEffect } from 'react';
import { fetchMyApplications, apiClient } from '../api';
import { FileText, MapPin, CheckCircle2, AlertCircle, Calendar, IndianRupee, Clock, Download, ArrowRight, ShieldCheck, Building2 } from 'lucide-react';

export default function CitizenDashboard({ user }) {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyApplications().then(data => {
      setApps(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-[160px] pb-12 animate-in fade-in duration-500">
      
      
      {/* Official Dashboard Header */}
      {apps.length > 0 && apps[0].status.includes('Disbursed') && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-10 fade-in duration-500">
          <div className="bg-emerald-900/90 backdrop-blur-md text-emerald-50 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-emerald-500/30">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-sm font-bold">SMS Alert Sent: Loan amount credited to your registered bank account.</span>
          </div>
        </div>
      )}

      <div className="bg-primary rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden mb-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 font-black text-xs uppercase tracking-widest border border-blue-500/30 mb-4">
              Citizen Portal
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Welcome, {user?.name || 'Applicant'}</h1>
            <p className="text-slate-400 font-medium text-lg">Manage your MoSJE/NSFDC scheme applications securely.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex items-center gap-4">
            <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-500/30">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-black mb-1">Account Status</p>
              <p className="font-black text-xl text-white">Verified</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-black text-primary flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            My Applications
          </h2>
          <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-sm font-bold border border-slate-200">
            {apps.length} Total
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-[#0f172a]"></div>
          </div>
        ) : apps.length === 0 ? (
          <div className="bg-white p-16 rounded-3xl border border-slate-200 text-center shadow-xl shadow-slate-200/50">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-slate-700 mb-2">No Applications Found</h3>
            <p className="text-slate-500 font-medium text-lg">You haven't submitted any scheme applications yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {apps.map((app, idx) => (
              <div key={idx} className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden group hover:shadow-2xl transition-all duration-300">
                
                {/* Card Header */}
                <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-start">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest border mb-3 ${
                      app.status.includes('Disbursed') ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                      app.status.includes('Rejected') ? 'bg-rose-100 text-rose-800 border-rose-200' :
                      app.status.includes('KYC') ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      'bg-amber-100 text-amber-800 border-amber-200'
                    }`}>
                      {app.status}
                    </span>
                    <h3 className="text-xl font-black text-primary leading-tight mb-2">
                      {app.scheme_data?.scheme_name || 'Loan Application'}
                    </h3>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                      ARN: <span className="text-slate-800">{app.arn}</span>
                    </p>
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                  {/* Financials Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#f8fafc] p-4 md:p-5 rounded-2xl border border-slate-100">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Approved Limit</p>
                      <p className="text-2xl md:text-3xl font-black text-primary">
                        ₹{(app.scheme_data?.max_loan_limit || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="bg-emerald-50 p-4 md:p-5 rounded-2xl border border-emerald-100">
                      <p className="text-xs font-black text-emerald-600/70 uppercase tracking-widest mb-1">Interest Rate</p>
                      <p className="text-2xl md:text-3xl font-black text-emerald-700">
                        {app.scheme_data?.interest_rate_pct || 0}% <span className="text-sm font-bold">p.a.</span>
                      </p>
                    </div>
                  </div>


                  {/* Application Lifecycle Stepper */}
                  <div className="py-4">
                    <div className="flex justify-between items-center relative">
                      <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-200 -z-10 -translate-y-1/2"></div>
                      <div className="absolute left-0 top-1/2 h-1 bg-emerald-500 -z-10 -translate-y-1/2 transition-all duration-1000" style={{ width: app.status.includes('Disbursed') ? '100%' : app.status.includes('KYC') ? '66%' : app.status.includes('Routed') ? '33%' : '100%' }}></div>
                      
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md"><CheckCircle2 className="w-5 h-5"/></div>
                        <span className="text-[10px] font-bold text-slate-600 mt-2">AI Verified</span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md ${!app.status.includes('Rejected') ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-500'}`}><CheckCircle2 className="w-5 h-5"/></div>
                        <span className="text-[10px] font-bold text-slate-600 mt-2">Routed</span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md ${app.status.includes('Disbursed') || app.status.includes('KYC') ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-500'}`}>{app.status.includes('Disbursed') || app.status.includes('KYC') ? <CheckCircle2 className="w-5 h-5"/> : '3'}</div>
                        <span className="text-[10px] font-bold text-slate-600 mt-2">Bank KYC</span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md ${app.status.includes('Disbursed') ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-500'}`}>{app.status.includes('Disbursed') ? <CheckCircle2 className="w-5 h-5"/> : '4'}</div>
                        <span className="text-[10px] font-bold text-slate-600 mt-2">Disbursed</span>
                      </div>
                    </div>
                  </div>

                  {/* Next Steps Action Card */}
                  {!app.status.includes('Disbursed') && !app.status.includes('Rejected') && (
                    <div className="bg-amber-50 rounded-2xl p-5 md:p-6 border border-amber-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <AlertCircle className="w-24 h-24 text-amber-500" />
                      </div>
                      <div className="relative z-10">
                        <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" /> Action Required
                        </h4>
                        <p className="text-sm font-bold text-amber-900 leading-relaxed mb-4">
                          Please visit the <strong className="text-amber-950 font-black">{app.branch_data?.name}</strong> within 15 days to complete physical KYC. Take your physical Aadhaar, Caste Certificate, and the downloaded Sanction Docket.
                        </p>
                        
                        <div className="flex gap-3">
                          <button onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(app.branch_data?.name + ' ' + app.branch_data?.district)}`, '_blank')} className="text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-md">
                            <MapPin className="w-4 h-4" /> Navigate to Branch
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Disbursed Card */}
                  {app.status.includes('Disbursed') && (
                    <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 text-center">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                      <h4 className="font-black text-emerald-800">Funds Disbursed</h4>
                      <p className="text-sm font-bold text-emerald-700 mt-1">Your loan amount has been credited by {app.branch_data?.name}.</p>
                    </div>
                  )}

                  {/* Rejected Card */}
                  {app.status.includes('Rejected') && (
                    <div className="bg-rose-50 rounded-2xl p-5 border border-rose-200 text-center">
                      <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
                      <h4 className="font-black text-rose-800">Application Rejected</h4>
                      <p className="text-sm font-bold text-rose-700 mt-1">Please contact the nodal officer for details.</p>
                    </div>
                  )}


                  {/* Actions */}
                  <div className="flex justify-between items-center pt-2 print:hidden">
                    <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4"/> {app.created_at ? new Date(app.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <button onClick={() => window.open(`${apiClient.defaults.baseURL}/applications/${app.arn}/pdf`, '_blank')} className="flex items-center gap-2 bg-primary hover:bg-blue-900 text-white px-6 py-3 rounded-xl font-black text-sm shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-0.5">
                      <Download className="w-4 h-4" /> Sanction Docket
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

