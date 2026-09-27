import React, { useState } from 'react';
import { LogIn, User, ShieldCheck, Mic, Sparkles, Home, Layers, Search, Compass } from 'lucide-react';

export default function Navbar({ onOpenChat, onOpenAudioKiosk, user, onLoginClick, onLogoutClick, onDashboardClick, onBrowseDirectory, onHomeClick, onAdminClick }) {
  const [scale, setScale] = useState(100);
  const scaleText = (factor) => {
    let newScale = scale;
    if (factor === 'reset') newScale = 100;
    else if (factor === 'increase') newScale = Math.min(scale + 10, 150);
    else if (factor === 'decrease') newScale = Math.max(scale - 10, 70);
    
    setScale(newScale);
    document.documentElement.style.fontSize = `${newScale}%`;
  };

  return (
    <header className="fixed w-full top-0 z-50 transition-all duration-300">
      {/* GOVT UTILITY BAR */}
      <div className="bg-[#090d16] text-slate-300 text-[11px] font-medium tracking-wide border-b border-slate-800/60">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex justify-between items-center h-8">
          <div className="flex gap-3 items-center">
            <span className="font-bold text-slate-200 uppercase tracking-wider text-[10px] md:text-[11px]">Government of India</span>
            <span className="opacity-40">|</span>
            <span className="font-medium opacity-90 hidden md:inline-block text-[10px] md:text-[11px]">Ministry of Social Justice and Empowerment</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#main-content" onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('main-content');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                  el.focus();
                }
              }} className="hover:text-white opacity-80 transition-colors hidden sm:block">Skip to main content</a>
            <div className="flex items-center gap-1.5 opacity-90 border-l border-slate-800 pl-3">
              <button onClick={() => scaleText('decrease')} title="Decrease Font Size" className="px-1.5 py-0.5 hover:bg-slate-800 rounded font-bold text-[11px]">A-</button>
              <button onClick={() => scaleText('reset')} title="Reset Font Size" className="px-1.5 py-0.5 hover:bg-slate-800 rounded font-bold text-[11px]">A</button>
              <button onClick={() => scaleText('increase')} title="Increase Font Size" className="px-1.5 py-0.5 hover:bg-slate-800 rounded font-bold text-[11px]">A+</button>
            </div>
            <div className="flex items-center gap-2 border-l border-slate-800 pl-3 font-semibold">
              <button onClick={() => window.switchToEnglish?.()} className="hover:text-amber-400 transition-colors">English</button>
              <span className="opacity-40">|</span>
              <button onClick={() => window.switchToHindi?.()} className="hover:text-amber-400 transition-colors">हिन्दी</button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <nav className="bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-sm relative z-40">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 md:gap-4 cursor-pointer group shrink-0" onClick={onHomeClick || (() => window.location.href='/')}>
            <div className="w-9 h-11 md:w-11 md:h-13 flex items-center justify-center shrink-0">
               <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Satyameva Jayate" className="h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300" />
            </div>
            
            <div className="flex flex-col border-l border-slate-200 pl-3 md:pl-4 py-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xl md:text-2xl font-black text-[#0f172a] tracking-tight group-hover:text-blue-900 transition-colors">
                  MoSJE <span className="text-amber-600">Samriddhi</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider hidden sm:inline-block">
                  SIH 2026
                </span>
              </div>
              <p className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 hidden sm:block">
                Zero-Hallucination Channel Finance
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="hidden lg:flex items-center bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60 space-x-1">
            <button 
              onClick={onHomeClick} 
              className="px-4 py-1.5 text-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-white rounded-full transition-all shadow-none hover:shadow-sm"
            >
              Home
            </button>
            <button 
              onClick={onBrowseDirectory} 
              className="px-4 py-1.5 text-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-white rounded-full transition-all shadow-none hover:shadow-sm"
            >
              Schemes
            </button>
            <button 
              onClick={() => { if(user) { onDashboardClick(); } else { onLoginClick(); } }} 
              className="px-4 py-1.5 text-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-white rounded-full transition-all shadow-none hover:shadow-sm"
            >
              Track Application
            </button>
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            
            {/* Voice Kiosk Button */}
            <button
              onClick={onOpenAudioKiosk}
              title="Voice Kiosk Assistant"
              className="flex items-center gap-2 px-3.5 md:px-4 py-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-full text-xs md:text-sm font-bold shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 transition-all group"
            >
              <Mic className="w-4 h-4 text-amber-100 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Voice Kiosk</span>
            </button>

            {/* Ask AI Assistant Button */}
            <button
              onClick={onOpenChat}
              title="Ask AI Assistant"
              className="flex items-center gap-2 px-3.5 md:px-4 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white rounded-full text-xs md:text-sm font-bold shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all group"
            >
              <Sparkles className="w-4 h-4 text-indigo-200 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
            
            <div className="h-6 w-px bg-slate-200 hidden md:block mx-0.5"></div>

            {/* Admin Dashboard */}
            <button
              onClick={onAdminClick}
              className="flex items-center gap-1.5 px-3.5 md:px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs md:text-sm font-bold shadow-sm hover:shadow transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden xl:inline">Admin</span>
            </button>

            {/* User Login / Citizen Dashboard */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onDashboardClick}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs md:text-sm font-bold shadow-sm transition-all"
                >
                  <User className="w-4 h-4 text-amber-400" /> 
                  <span className="hidden sm:inline">Dashboard</span>
                </button>
                <button 
                  onClick={onLogoutClick} 
                  className="text-xs font-bold text-slate-500 hover:text-rose-600 px-2 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs md:text-sm font-bold shadow-sm transition-all"
              >
                <LogIn className="w-4 h-4" /> 
                <span>Login</span>
              </button>
            )}
          </div>

        </div>
      </nav>
    </header>
  );
}
