import React from 'react';
import { ArrowRight, ShieldCheck, MapPin, Brain, FileCheck, Building2, TrendingUp, Search, Landmark, Target, CheckCircle2 } from 'lucide-react';

export default function LandingPage({ onStartApply, onBrowseDirectory }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out min-h-screen bg-[#f8fafc] font-sans selection:bg-amber-200 selection:text-amber-900">
      
      {/* HERO SECTION - Official & Photographic */}
      <section className="relative bg-[#0f172a] text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/hero_msme.jpg" 
            alt="Indian MSME Entrepreneurs" 
            className="w-full h-full object-cover object-center opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/90 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pt-40 pb-24 lg:pt-48 lg:pb-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-emerald-300 font-semibold text-base uppercase tracking-widest mb-6 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              SIH26092 Initiative
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6">
              Apply for MoSJE Loan <br/>
              <span className="text-amber-500 text-3xl md:text-5xl block mt-4">Empowering Marginalized Entrepreneurs</span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-10 leading-relaxed font-medium max-w-2xl">
              Access MoSJE and NSFDC concessional lending schemes through a 100% deterministic, zero-hallucination routing engine. Instant eligibility, transparent EMIs, and NPA-aware branch mapping.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onStartApply}
                className="group flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 py-4 rounded-xl font-black text-lg shadow-xl shadow-amber-500/20 transition-all hover:-translate-y-1"
              >
                Check Eligibility & Apply
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={onBrowseDirectory}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-xl font-bold text-lg transition-all"
              >
                <Search className="w-5 h-5 opacity-70" />
                Browse Schemes
              </button>
            </div>
          </div>
        </div>

        {/* Stats Ribbon */}
        <div className="border-t border-white/10 bg-black/20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10 py-6">
              <div className="text-center px-4">
                <p className="text-3xl font-black text-white">25+</p>
                <p className="text-base font-medium text-slate-400 uppercase tracking-wide mt-1">Live MoSJE Schemes</p>
              </div>
              <div className="text-center px-4">
                <p className="text-3xl font-black text-white">294</p>
                <p className="text-base font-medium text-slate-400 uppercase tracking-wide mt-1">Channel Partners</p>
              </div>
              <div className="text-center px-4">
                <p className="text-3xl font-black text-white">₹50L</p>
                <p className="text-base font-medium text-slate-400 uppercase tracking-wide mt-1">Max Term Loan</p>
              </div>
              <div className="text-center px-4">
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck className="w-8 h-8 text-emerald-400" />
                  <p className="text-3xl font-black text-emerald-400">0%</p>
                </div>
                <p className="text-base font-medium text-emerald-500 uppercase tracking-wide mt-1">AI Hallucination</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCHEME CATEGORIES - Visual Grid */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#0f172a] mb-4">Dedicated Schemes for Every Sector</h2>
            <div className="w-24 h-1.5 bg-amber-500 mx-auto rounded-full mb-6"></div>
            <p className="text-slate-600 font-medium text-lg">Our deterministic engine matches your exact demographic and socioeconomic profile to the perfect concessional loan scheme.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Mahila Samriddhi */}
            <div className="group rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white hover:shadow-2xl transition-all duration-300">
              <div className="h-48 overflow-hidden relative">
                <img src="/assets/women.jpg" alt="Mahila Samriddhi" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                <h3 className="absolute bottom-4 left-6 text-2xl font-black text-white">Mahila Samriddhi</h3>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4 text-base font-medium">Empowering women entrepreneurs with micro-finance up to ₹1.40 Lakh at ultra-low interest rates (4% p.a.).</p>
                <div className="flex justify-between items-center text-base font-bold">
                  <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Rebate Available</span>
                  <button onClick={onBrowseDirectory} className="text-blue-700 hover:text-blue-900 flex items-center gap-1">Details <ArrowRight className="w-4 h-4"/></button>
                </div>
              </div>
            </div>

            {/* Shilpi Samriddhi */}
            <div className="group rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white hover:shadow-2xl transition-all duration-300">
              <div className="h-48 overflow-hidden relative">
                <img src="/assets/artisan.jpg" alt="Shilpi Samriddhi" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                <h3 className="absolute bottom-4 left-6 text-2xl font-black text-white">Shilpi Samriddhi</h3>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4 text-base font-medium">Financial assistance for traditional artisans and craftsmen to upgrade tools, setup workshops, and scale production.</p>
                <div className="flex justify-between items-center text-base font-bold">
                  <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Up to ₹5.0 Lakh</span>
                  <button onClick={onBrowseDirectory} className="text-blue-700 hover:text-blue-900 flex items-center gap-1">Details <ArrowRight className="w-4 h-4"/></button>
                </div>
              </div>
            </div>

            {/* Term Loans / Agriculture */}
            <div className="group rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white hover:shadow-2xl transition-all duration-300">
              <div className="h-48 overflow-hidden relative">
                <img src="/assets/agri.jpg" alt="Term Loan Yojana" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                <h3 className="absolute bottom-4 left-6 text-2xl font-black text-white">Term Loan Yojana</h3>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4 text-base font-medium">Large-ticket concessional finance for agricultural, industrial, and service sector ventures with long moratorium periods.</p>
                <div className="flex justify-between items-center text-base font-bold">
                  <span className="text-amber-600 bg-amber-50 px-3 py-1 rounded-full">Up to ₹50.0 Lakh</span>
                  <button onClick={onBrowseDirectory} className="text-blue-700 hover:text-blue-900 flex items-center gap-1">Details <ArrowRight className="w-4 h-4"/></button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW TO APPLY - Official Infographic Style */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-[#0f172a] mb-4">Application Process</h2>
              <div className="w-16 h-1.5 bg-amber-500 rounded-full mb-4"></div>
              <p className="text-slate-600 font-medium max-w-2xl">A radically simplified 4-step digital journey. Zero paperwork, zero hallucination, and mathematically guaranteed routing.</p>
            </div>
            <button onClick={onStartApply} className="shrink-0 bg-[#0f172a] hover:bg-blue-900 text-white px-6 py-3 rounded-xl font-bold shadow-md transition-colors">Start Application →</button>
          </div>

          <div className="grid md:grid-cols-4 gap-4 relative">
            {/* Desktop connecting line */}
            <div className="hidden md:block absolute top-10 left-12 right-12 h-0.5 bg-slate-200 z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-black text-xl mb-6 shadow-sm border-4 border-white mx-auto md:mx-0">1</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 text-center md:text-left"><FileCheck className="w-5 h-5 inline-block mr-1 text-blue-600" /> Digital KYC</h3>
              <p className="text-base text-slate-500 text-center md:text-left">Upload your Caste/Income certificates. Our Human-In-The-Loop OCR extracts and verifies your demographic data instantly.</p>
            </div>
            
            {/* Step 2 */}
            <div className="relative z-10 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-black text-xl mb-6 shadow-sm border-4 border-white mx-auto md:mx-0">2</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 text-center md:text-left"><Brain className="w-5 h-5 inline-block mr-1 text-indigo-600" /> Strict Verification</h3>
              <p className="text-base text-slate-500 text-center md:text-left">The Deterministic Rule Engine evaluates your exact profile against statutory thresholds to find 100% eligible schemes.</p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-black text-xl mb-6 shadow-sm border-4 border-white mx-auto md:mx-0">3</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 text-center md:text-left"><TrendingUp className="w-5 h-5 inline-block mr-1 text-emerald-600" /> EMI Moratorium</h3>
              <p className="text-base text-slate-500 text-center md:text-left">Calculate your exact capitalized interest and choose your grace period with our transparent financial tools.</p>
            </div>

            {/* Step 4 */}
            <div className="relative z-10 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-b-4 border-b-amber-500">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-black text-xl mb-6 shadow-sm border-4 border-white mx-auto md:mx-0">4</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 text-center md:text-left"><MapPin className="w-5 h-5 inline-block mr-1 text-amber-600" /> NPA-Aware Routing</h3>
              <p className="text-base text-slate-500 text-center md:text-left">We geographically route your application to the nearest healthy Channel Partner, bypassing banks with high NPAs.</p>
            </div>

          </div>
        </div>
      </section>

      {/* GEO-SPATIAL TRANSPARENCY BLOCK */}
      <section className="py-24 bg-[#0f172a] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full text-blue-500 fill-current" preserveAspectRatio="none">
             <path d="M0,100 C20,80 40,20 100,0 L100,100 Z" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-blue-900/50 text-blue-300 font-bold text-base uppercase tracking-widest mb-4">
                  SIH26092 Compliance
                </div>
                <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">Smart Routing.<br/>Zero Dead Ends.</h2>
                <p className="text-slate-400 font-medium leading-relaxed text-lg">
                  Government applications often get stuck at branches with high Non-Performing Assets (NPAs) or exhausted budgets. MoSJE Samriddhi solves this mathematically.
                </p>
              </div>

              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="mt-1 w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">Fund Utilization Checks</h4>
                    <p className="text-base text-slate-400">Instantly filters out SCAs/Banks that have depleted their disbursal limits.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1 w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">Strict NPA Thresholds</h4>
                    <p className="text-base text-slate-400">Actively bypasses partners with &gt;10% NPAs, securing your application's success rate.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1 w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">Proximity Prioritization</h4>
                    <p className="text-base text-slate-400">Ranks remaining healthy branches by Haversine distance to your district location.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Visual Dashboard Representation */}
            <div className="relative bg-slate-800 p-2 rounded-3xl border border-slate-700 shadow-2xl">
              <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700/50">
                <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
                  <span className="font-bold text-slate-300">Nearest Branch Analysis</span>
                  <span className="text-base bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded font-bold">294 Evaluated</span>
                </div>
                <div className="p-6 space-y-4">
                  
                  {/* Recommended */}
                  <div className="bg-emerald-950/30 border border-emerald-900/50 p-4 rounded-xl flex justify-between items-center relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                    <div>
                      <h4 className="font-bold text-white flex items-center gap-2">Indian Bank - Micro Hub <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded uppercase">Selected</span></h4>
                      <p className="text-base text-slate-400 mt-1">Distance: 4.2 km | Funds: ₹210L</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-black text-lg">1.2%</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">NPA Rate</p>
                    </div>
                  </div>

                  {/* Bypassed 1 */}
                  <div className="bg-rose-950/30 border border-rose-900/50 p-4 rounded-xl flex justify-between items-center relative overflow-hidden opacity-60 grayscale hover:grayscale-0 transition-all">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500"></div>
                    <div>
                      <h4 className="font-bold text-slate-300 flex items-center gap-2 line-through">Canara Bank - SME</h4>
                      <p className="text-base text-rose-400/80 mt-1">⚠ Bypassed: High Overdues</p>
                    </div>
                    <div className="text-right">
                      <p className="text-rose-400 font-black text-lg">14.5%</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">NPA Rate</p>
                    </div>
                  </div>

                   {/* Bypassed 2 */}
                   <div className="bg-amber-950/30 border border-amber-900/50 p-4 rounded-xl flex justify-between items-center relative overflow-hidden opacity-60 grayscale hover:grayscale-0 transition-all">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                    <div>
                      <h4 className="font-bold text-slate-300 flex items-center gap-2 line-through">TAHDCO Branch 04</h4>
                      <p className="text-base text-amber-400/80 mt-1">⚠ Bypassed: Budget Exhausted</p>
                    </div>
                    <div className="text-right">
                      <p className="text-amber-400 font-black text-lg">3.4%</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">NPA Rate</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER - Official Government Look */}
      <footer className="bg-[#0f172a] text-slate-400 py-12 border-t border-slate-800 text-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-8 border-b border-slate-800 pb-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="GOI" className="h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-white font-black text-lg leading-tight">MoSJE Samriddhi</h3>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Ministry of Social Justice & Empowerment</p>
                </div>
              </div>
              <p className="text-base leading-relaxed max-w-sm">
                A highly secure, zero-hallucination platform engineered for SIH26092. Empowering marginalized sectors through deterministic scheme matching and NPA-aware geo-spatial routing.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-base">Platform</h4>
              <ul className="space-y-2 text-base">
                <li><a href="#" className="hover:text-amber-500 transition-colors">Apply for Loan</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Scheme Directory</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Track Application Status</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Channel Partners List</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-base">Policies</h4>
              <ul className="space-y-2 text-base">
                <li><a href="#" className="hover:text-amber-500 transition-colors">Accessibility Statement</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Help & Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-base font-medium">
            <p>&copy; 2024 Developed for Smart India Hackathon (SIH). Prototype for MoSJE / NSFDC.</p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Designed with strict compliance to GIGW 3.0 standards.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
