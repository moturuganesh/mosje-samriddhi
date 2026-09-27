import React, { useState } from 'react';
import { X, Phone, Lock, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { login, register } from '../api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMode('otp');
    }, 800);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.length < 4) {
      setError("Enter the 4-digit OTP.");
      return;
    }
    setError(null);
    setMode('register_or_login'); 
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setError("Security PIN must be 4 digits.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      let data;
      if (mode === 'register') {
        if (!name.trim()) throw new Error("Name is required");
        data = await register(phone, pin, name);
      } else {
        data = await login(phone, pin);
      }
      if (data && data.access_token) {
        onAuthSuccess(data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-[#0f172a]/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 ease-out">
        
        <div className="bg-[#0f172a] p-8 md:p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl"></div>
          
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all z-10">
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex justify-center mb-6 relative z-10">
            <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center shadow-inner backdrop-blur-sm">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-center tracking-tight">Citizen Authentication</h2>
          <p className="text-slate-400 text-sm md:text-base text-center mt-3 font-medium">Verify your identity via Mobile & PIN</p>
        </div>

        <div className="p-8 md:p-10 bg-slate-50">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 text-rose-700 text-sm rounded-xl border border-rose-200 font-bold flex items-center gap-3 animate-in slide-in-from-top-2">
              <div className="w-1.5 h-6 bg-rose-500 rounded-full"></div>
              {error}
            </div>
          )}

          {mode === 'login' || mode === 'register' ? (
            <form onSubmit={handleAuth} className="space-y-6">
              {mode === 'register' && (
                <div className="space-y-2 animate-in slide-in-from-bottom-4">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Full Legal Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-[#0f172a] focus:ring-4 focus:ring-slate-900/5 transition-all font-bold text-slate-800 text-lg bg-white"
                      placeholder="e.g. Priyadarshini M"
                      required
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2 animate-in slide-in-from-bottom-4" style={{ animationDelay: '50ms' }}>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Registered Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">+91</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full pl-14 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-[#0f172a] focus:ring-4 focus:ring-slate-900/5 transition-all font-black text-slate-800 text-xl tracking-widest bg-white"
                    placeholder="98765 43210"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 animate-in slide-in-from-bottom-4" style={{ animationDelay: '100ms' }}>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Secure 4-Digit PIN</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-[#0f172a] focus:ring-4 focus:ring-slate-900/5 transition-all font-black text-slate-800 text-2xl tracking-[0.5em] bg-white"
                    placeholder="••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-600 text-[#0f172a] py-4 rounded-xl font-black text-lg shadow-xl shadow-amber-500/20 transition-all hover:-translate-y-1 disabled:opacity-50 mt-8"
              >
                {loading ? 'Authenticating...' : (mode === 'register' ? 'Register & Continue' : 'Secure Login')}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          ) : mode === 'register_or_login' ? (
             <div className="space-y-4 animate-in slide-in-from-right-8">
               <button onClick={() => setMode('login')} className="w-full bg-[#0f172a] text-white font-black py-4 rounded-xl shadow-lg hover:-translate-y-1 transition-all text-lg">I already have a PIN (Login)</button>
               <button onClick={() => setMode('register')} className="w-full bg-white border-2 border-slate-200 text-slate-700 hover:border-[#0f172a] hover:text-[#0f172a] font-black py-4 rounded-xl shadow-sm transition-all text-lg">Set up a PIN (Register)</button>
             </div>
          ) : mode === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-6 animate-in slide-in-from-right-8">
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest text-center">Mobile Number</label>
                <div className="relative max-w-xs mx-auto">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">+91</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full pl-14 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-[#0f172a] text-center font-black text-slate-800 text-2xl tracking-widest bg-white"
                    placeholder="9876543210"
                    autoFocus
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-[#0f172a] hover:bg-blue-900 text-white py-4 rounded-xl font-black text-lg shadow-xl transition-all mt-4 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Secure OTP'} <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in slide-in-from-right-8">
              <div className="text-center mb-6">
                <p className="text-slate-600 font-medium">OTP sent securely to <span className="font-black text-[#0f172a]">+91 {phone}</span></p>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest text-center">Enter 4-Digit OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 focus:border-[#0f172a] text-center font-black text-slate-800 text-3xl tracking-[0.5em] bg-white"
                  placeholder="••••"
                  autoFocus
                  required
                />
                <p className="text-center text-xs text-slate-400 font-medium pt-2">SIH Prototype: Enter any 4 digits (e.g. 1234)</p>
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-black text-lg shadow-xl shadow-emerald-500/20 transition-all mt-4"
              >
                Verify OTP <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          )}

          {mode === 'register' && (
            <div className="mt-8 text-center">
              <button onClick={(e) => { e.preventDefault(); setMode('login'); }} className="text-sm font-bold text-blue-600 hover:text-blue-800 underline underline-offset-4">
                Already have an account? Login here
              </button>
            </div>
          )}

          {mode === 'login' && (
            <div className="mt-8 text-center">
              <button onClick={(e) => { e.preventDefault(); setMode('register'); }} className="text-sm font-bold text-blue-600 hover:text-blue-800 underline underline-offset-4">
                First time? Register here
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
