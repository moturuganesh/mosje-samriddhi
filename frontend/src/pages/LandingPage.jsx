import React from 'react';
import { ArrowRight, ShieldCheck, MapPin, Brain, FileCheck, Building2, TrendingUp, Search, Landmark, Target, CheckCircle2, Award, Users, Zap } from 'lucide-react';

export default function LandingPage({ onStartApply, onBrowseDirectory }) {
  return (
    <div className="animate-in fade-in duration-500 min-h-screen bg-[#f8fafc] font-sans selection:bg-amber-200 selection:text-amber-900">
      
      {/* HERO SECTION - Premium Government & Modern Fintech */}
      <section className="relative bg-[#090d16] text-white overflow-hidden">
        {/* Background Image with Ambient Glow Overlays */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img 
            src="/assets/hero_msme.jpg" 
            alt="Indian MSME Entrepreneurs" 
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090d16] via-[#090d16]/90 to-[#090d16]/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-transparent"></div>
          
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pt-36 pb-20 lg:pt-44 lg:pb-28">
          <div className="max-w-3xl">
            
            {/* Initiative Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-amber-400 font-bold text-xs md:text-sm uppercase tracking-wider mb-6 backdrop-blur-md shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>SIH 2026 National Initiative</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300">MoSJE &amp; NSFDC</span>
            </div>
            
            {/* Hero Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.15] tracking-tight mb-6">
              Apply for MoSJE Loan <br/>
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent block mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold">
                Empowering Marginalized Entrepreneurs
              </span>
            </h1>
            
            {/* Hero Description */}
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed font-normal max-w-2xl">
              Access MoSJE and NSFDC concessional lending schemes through a 100% deterministic, zero-hallucination routing engine. Instant eligibility, transparent EMIs, and NPA-aware branch mapping.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <button 
                onClick={onStartApply}
                className="group flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 px-8 py-4 rounded-xl font-black text-base md:text-lg shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Check Eligibility &amp; Apply</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={onBrowseDirectory}
                className="flex items-center justify-center gap-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-100 border border-slate-700 px-8 py-4 rounded-xl font-bold text-base md:text-lg transition-all backdrop-blur-md hover:-translate-y-0.5"
              >
                <Search className="w-5 h-5 text-amber-400 opacity-80" />
                <span>Browse Schemes Directory</span>
              </button>
            </div>

          </div>
        </div>

        {/* Stats Ribbon - Fully Padded & Responsive */}
        <div className="border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-xl relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/80">
              
              <div className="flex items-center gap-4 px-2 lg:px-4 py-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-black text-white tracking-tight">24+</p>
                  <p className="text-xs md:text-sm font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Live Schemes</p>
                </div>
              </div>

              <div className="flex items-center gap-4 px-2 lg:px-4 py-2 pt-4 sm:pt-2">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-black text-white tracking-tight">4,800+</p>
                  <p className="text-xs md:text-sm font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Channel Partners</p>
                </div>
              </div>

              <div className="flex items-center gap-4 px-2 lg:px-4 py-2 pt-4 lg:pt-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-black text-white tracking-tight">₹50 Lakh</p>
                  <p className="text-xs md:text-sm font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Max Loan Limit</p>
                </div>
              </div>

              <div className="flex items-center gap-4 px-2 lg:px-4 py-2 pt-4 lg:pt-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-black text-emerald-400 tracking-tight">0%</p>
                  <p className="text-xs md:text-sm font-bold text-emerald-400 uppercase tracking-wider mt-0.5">Hallucination Risk</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* SCHEME CATEGORIES - Visual Grid */}
      <section className="py-20 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#0f172a] tracking-tight mb-4">Dedicated Schemes for Every Sector</h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full mb-6"></div>
            <p className="text-slate-600 font-medium text-base md:text-lg">Our deterministic engine matches your exact demographic and socioeconomic profile to the perfect concessional loan scheme.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Mahila Samriddhi */}
            <div className="group rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/80 bg-white transition-all duration-300 flex flex-col">
              <div className="h-52 overflow-hidden relative">
                <img src="/assets/women.jpg" alt="Mahila Samriddhi" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                <h3 className="absolute bottom-4 left-6 text-2xl font-black text-white">Mahila Samriddhi</h3>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-slate-600 mb-6 text-sm font-medium leading-relaxed">Empowering female entrepreneurs with micro-finance up to ₹1.40 Lakh at ultra-low interest rates (4% p.a.).</p>
                <div className="flex justify-between items-center text-sm font-bold border-t border-slate-100 pt-4">
                  <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs font-black uppercase">4% Interest</span>
                  <button onClick={onBrowseDirectory} className="text-blue-700 hover:text-blue-900 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                    <span>Explore Details</span>
                    <ArrowRight className="w-4 h-4"/>
                  </button>
                </div>
              </div>
            </div>

            {/* Shilpi Samriddhi */}
            <div className="group rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/80 bg-white transition-all duration-300 flex flex-col">
              <div className="h-52 overflow-hidden relative">
                <img src="/assets/artisan.jpg" alt="Shilpi Samriddhi" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                <h3 className="absolute bottom-4 left-6 text-2xl font-black text-white">Shilpi Samriddhi</h3>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-slate-600 mb-6 text-sm font-medium leading-relaxed">Financial assistance for SC artisans and traditional craftspeople to purchase modern equipment and raw materials.</p>
                <div className="flex justify-between items-center text-sm font-bold border-t border-slate-100 pt-4">
                  <span className="text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs font-black uppercase">Artisan Grant</span>
                  <button onClick={onBrowseDirectory} className="text-blue-700 hover:text-blue-900 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                    <span>Explore Details</span>
                    <ArrowRight className="w-4 h-4"/>
                  </button>
                </div>
              </div>
            </div>

            {/* Agri & MSME */}
            <div className="group rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/80 bg-white transition-all duration-300 flex flex-col">
              <div className="h-52 overflow-hidden relative">
                <img src="/assets/agri.jpg" alt="Agri & MSME Loans" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                <h3 className="absolute bottom-4 left-6 text-2xl font-black text-white">Agri &amp; MSME Term Loans</h3>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-slate-600 mb-6 text-sm font-medium leading-relaxed">Large-scale concessional term loans up to ₹50 Lakhs for setting up manufacturing, commercial transport, and solar units.</p>
                <div className="flex justify-between items-center text-sm font-bold border-t border-slate-100 pt-4">
                  <span className="text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full text-xs font-black uppercase">Up to ₹50L</span>
                  <button onClick={onBrowseDirectory} className="text-blue-700 hover:text-blue-900 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                    <span>Explore Details</span>
                    <ArrowRight className="w-4 h-4"/>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-medium">
            <p>&copy; 2026 Developed for Smart India Hackathon (SIH 2026). Prototype for MoSJE / NSFDC.</p>
            <div className="flex items-center gap-6 text-slate-400">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Deterministic Scheme Router</span>
              </span>
              <span>|</span>
              <span>Problem Statement SIH26092</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
