import React, { useState } from 'react';
import { LogIn, User, ShieldCheck, Mic, Sparkles, Menu, X } from 'lucide-react';

export default function Navbar({ onOpenChat, onOpenAudioKiosk, user, onLoginClick, onLogoutClick, onDashboardClick, onBrowseDirectory, onHomeClick, onAdminClick }) {
  const [scale, setScale] = useState(100);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scaleText = (factor) => {
    let newScale = scale;
    if (factor === 'reset') newScale = 100;
    else if (factor === 'increase') newScale = Math.min(scale + 10, 150);
    else if (factor === 'decrease') newScale = Math.max(scale - 10, 70);
    
    setScale(newScale);
    document.documentElement.style.fontSize = `${newScale}%`;
  };

  return (
    <div className="fixed w-full top-0 z-50">
      {/* GOVT UTILITY BAR */}
      <div className="bg-[#1e293b] text-white text-xs font-medium tracking-wide">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex justify-between items-center h-10">
          <div className="flex gap-4 items-center">
            <span className="opacity-90 font-bold uppercase tracking-wider">Government of India</span>
            <span className="hidden md:inline-block opacity-60">|</span>
            <span className="opacity-90 hidden md:inline-block font-bold uppercase tracking-wider">Ministry of Social Justice and Empowerment</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#main-content" onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('main-content');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                  el.focus();
                }
              }} className="hover:underline opacity-90 font-semibold hidden sm:block">Skip to main content</a>
            <div className="flex items-center gap-2 opacity-90 sm:border-l border-slate-600 sm:pl-4 sm:ml-2">
              <button onClick={() => scaleText('decrease')} className="px-1.5 py-0.5 hover:bg-slate-700 rounded font-bold text-sm">A-</button>
              <button onClick={() => scaleText('reset')} className="px-1.5 py-0.5 hover:bg-slate-700 rounded font-bold text-sm">A</button>
              <button onClick={() => scaleText('increase')} className="px-1.5 py-0.5 hover:bg-slate-700 rounded font-bold text-sm">A+</button>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 border-l border-slate-600 pl-3 sm:pl-4 font-semibold">
              <span onClick={() => window.switchToEnglish?.()} className="cursor-pointer hover:text-amber-400 transition-colors">English</span>
              <span className="opacity-60">|</span>
              <span onClick={() => window.switchToHindi?.()} className="cursor-pointer hover:text-amber-400 transition-colors">हिन्दी</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <nav className="bg-white/95 backdrop-blur-md border-b-2 border-amber-500 shadow-md relative z-40">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4 flex flex-wrap xl:flex-nowrap items-center justify-between gap-y-3">
          
          <div className="flex items-center gap-4 cursor-pointer group shrink-0" onClick={onHomeClick || (() => window.location.href='/')}>
            {/* National Emblem */}
            <div className="w-10 h-12 md:w-12 md:h-14 flex items-center justify-center shrink-0">
               <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Satyameva Jayate" className="h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="flex flex-col border-l-2 border-slate-200 pl-4 py-1">
              <h1 className="text-2xl md:text-3xl font-black text-primary leading-none tracking-tight group-hover:text-blue-900 transition-colors flex items-center gap-2">
                MoSJE <span className="text-amber-600">Samriddhi</span>
              </h1>
              <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest mt-1.5 hidden sm:block">
                Zero-Hallucination Channel Finance Platform
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center space-x-1 shrink-0 ml-6">
            <button onClick={onHomeClick} className="px-4 py-2.5 text-base font-black text-slate-700 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all">Home</button>
            <button onClick={onBrowseDirectory} className="px-4 py-2.5 text-base font-black text-slate-700 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all">Schemes</button>
            <button onClick={() => { if(user) { onDashboardClick(); } else { onLoginClick(); } }} className="px-4 py-2.5 text-base font-black text-slate-700 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all">Track</button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-1 xl:flex-none justify-end items-center gap-2 md:gap-4 shrink-0 ml-auto">
            
            <div className="hidden lg:flex items-center gap-2 md:gap-4">
              <button
                onClick={onOpenAudioKiosk}
                title="Voice Kiosk"
                className="flex items-center gap-2 px-5 py-2.5 btn-accent text-white rounded-full font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all group"
              >
                <Mic className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base hidden sm:block">Voice Kiosk</span>
              </button>

              <button
                onClick={onOpenChat}
                title="Ask AI Assistant"
                className="flex items-center gap-2 px-5 py-2.5 btn-primary text-white rounded-full font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all group"
              >
                <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base hidden sm:block">Ask AI</span>
              </button>
              
              <div className="h-8 w-px bg-slate-200 hidden md:block mx-1"></div>

              <button
                onClick={onAdminClick}
                className="flex items-center gap-2 px-5 py-2.5 btn-ghost rounded-full font-bold transition-colors shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base hidden xl:block">Admin</span>
              </button>

              {user ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={onDashboardClick}
                    className="flex items-center gap-2 px-5 py-2.5 btn-accent text-white rounded-full font-bold transition-colors shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <User className="w-4 h-4 md:w-5 md:h-5" /> <span className="text-sm md:text-base hidden sm:block">Dashboard</span>
                  </button>
                  <button onClick={onLogoutClick} className="font-bold text-sm text-slate-500 hover:text-rose-600 px-2 transition-colors">Logout</button>
                </div>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="flex items-center gap-2 px-5 py-2.5 btn-accent text-white rounded-full font-bold transition-colors shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <LogIn className="w-4 h-4 md:w-5 md:h-5" /> <span className="text-sm md:text-base">Login</span>
                </button>
              )}
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-slate-700 bg-slate-100 rounded-lg">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b-2 border-amber-500 shadow-xl flex flex-col p-4 gap-4 animate-in slide-in-from-top-2">
            <button onClick={() => { onHomeClick(); setMobileMenuOpen(false); }} className="text-left px-4 py-2 font-black text-slate-700 hover:bg-slate-50 rounded-lg">Home</button>
            <button onClick={() => { onBrowseDirectory(); setMobileMenuOpen(false); }} className="text-left px-4 py-2 font-black text-slate-700 hover:bg-slate-50 rounded-lg">Schemes</button>
            <button onClick={() => { if(user) { onDashboardClick(); } else { onLoginClick(); } setMobileMenuOpen(false); }} className="text-left px-4 py-2 font-black text-slate-700 hover:bg-slate-50 rounded-lg">Track</button>
            
            <div className="h-px bg-slate-200 my-2"></div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => { onOpenAudioKiosk(); setMobileMenuOpen(false); }}
                className="flex justify-center items-center gap-2 px-5 py-2.5 btn-accent text-white rounded-full font-bold"
              >
                <Mic className="w-5 h-5" /> Voice Kiosk
              </button>

              <button
                onClick={() => { onOpenChat(); setMobileMenuOpen(false); }}
                className="flex justify-center items-center gap-2 px-5 py-2.5 btn-primary text-white rounded-full font-bold"
              >
                <Sparkles className="w-5 h-5" /> Ask AI
              </button>

              <button
                onClick={() => { onAdminClick(); setMobileMenuOpen(false); }}
                className="flex justify-center items-center gap-2 px-5 py-2.5 btn-ghost rounded-full font-bold"
              >
                <ShieldCheck className="w-5 h-5" /> Admin
              </button>

              {user ? (
                <>
                  <button
                    onClick={() => { onDashboardClick(); setMobileMenuOpen(false); }}
                    className="flex justify-center items-center gap-2 px-5 py-2.5 btn-accent text-white rounded-full font-bold"
                  >
                    <User className="w-5 h-5" /> Dashboard
                  </button>
                  <button onClick={() => { onLogoutClick(); setMobileMenuOpen(false); }} className="font-bold text-slate-500 hover:text-rose-600 py-2">Logout</button>
                </>
              ) : (
                <button
                  onClick={() => { onLoginClick(); setMobileMenuOpen(false); }}
                  className="flex justify-center items-center gap-2 px-5 py-2.5 btn-accent text-white rounded-full font-bold"
                >
                  <LogIn className="w-5 h-5" /> Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

