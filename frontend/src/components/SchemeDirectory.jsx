import React, { useState, useEffect } from 'react';
import { fetchAllSchemes } from '../api';
import { Search, X, Landmark, FileText, MapPin, Building2, CheckCircle2, ChevronRight } from 'lucide-react';

export default function SchemeDirectory({ onClose }) {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    fetchAllSchemes()
      .then(data => {
        setSchemes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load schemes:", err);
        setLoading(false);
      });
  }, []);

  const filtered = schemes.filter(s => {
    const matchesSearch = s.scheme_name.toLowerCase().includes(search.toLowerCase()) || 
                          s.description.toLowerCase().includes(search.toLowerCase()) ||
                          s.state_applicability.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    
    if (activeFilter === 'All') return true;
    
    const kw = activeFilter.toLowerCase();
    const audienceStr = (s.audience || []).join(' ').toLowerCase();
    return s.scheme_name.toLowerCase().includes(kw) || 
           s.description.toLowerCase().includes(kw) || 
           audienceStr.includes(kw);
  });

  return (
    <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div className="bg-slate-50 w-full max-w-6xl h-full max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 ease-out">
        
        {/* Premium Header */}
        <div className="bg-primary p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-4">
              <Landmark className="w-10 h-10 text-amber-400" />
              MoSJE Scheme Directory
            </h2>
            <p className="text-blue-200 font-medium text-lg mt-2">Comprehensive catalog of all active channel finance programmes.</p>
          </div>
          <button onClick={onClose} className="absolute md:relative top-6 md:top-0 right-6 md:right-0 p-3 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all z-10">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 md:p-8 border-b border-slate-200 bg-white shrink-0 shadow-sm z-10">
          <div className="relative max-w-3xl mx-auto">
            <Search className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by scheme name, state, or target audience..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-6 py-5 rounded-2xl border-2 border-slate-200 focus:border-primary focus:ring-4 focus:ring-slate-900/5 text-xl font-bold text-slate-800 transition-all placeholder:font-medium placeholder:text-slate-400 shadow-sm bg-slate-50 focus:bg-white"
            />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-3xl mx-auto">
             {['All', 'Micro Credit', 'Term Loan', 'Women', 'Students', 'Farmers', 'Youth'].map(f => (
               <button key={f} onClick={() => setActiveFilter(f)} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${activeFilter === f ? 'bg-accent text-primary shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                 {f}
               </button>
             ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-amber-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((s, idx) => (
                <div key={idx} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col animate-in slide-in-from-bottom-8" style={{ animationDelay: `${idx * 50}ms` }}>
                  
                  <div className="mb-4 flex-1">
                    <span className="inline-block px-3 py-1 rounded bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest border border-amber-200 mb-4">
                      {s.type}
                    </span>
                    <h3 className="text-xl font-black text-primary leading-tight mb-3">
                      {s.scheme_name}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-3">
                      {s.description}
                    </p>
                  </div>

                  <div className="space-y-4 border-t border-slate-100 pt-5 mt-auto">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Applicability</p>
                        <p className="text-sm font-bold text-slate-700">{s.state_applicability}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Audience</p>
                        <p className="text-sm font-bold text-slate-700">{s.audience.join(', ')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                     <div className="bg-primary text-white px-4 py-2 rounded-xl text-center">
                        <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">Max Loan</p>
                        <p className="font-black">₹{(s.max_loan_limit || 0).toLocaleString('en-IN')}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">Interest</p>
                        <p className="font-black text-emerald-600 text-lg">{s.interest_rate_pct}% p.a.</p>
                     </div>
                  </div>

                </div>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full text-center py-20">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-700 mb-2">No Schemes Found</h3>
                  <p className="text-slate-500 font-medium text-lg">Try adjusting your search criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

