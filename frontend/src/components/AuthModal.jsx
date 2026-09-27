import React, { useState } from 'react';
import { X, Lock, ArrowRight, ShieldCheck, User, Phone } from 'lucide-react';
import { register, login } from '../api';


export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!name || !phone || !pin) {
      setError("Please fill all details for demo access.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      let data;
      try {
        data = await register(phone, pin, name);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.detail === 'Phone number already registered.') {
          data = await login(phone, pin);
        } else {
          throw err;
        }
      }
      
      onAuthSuccess(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-surface rounded-[2rem] w-full max-w-md overflow-hidden shadow-glass-lg animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        
        {/* Header */}
        <div className="bg-primary p-6 sm:p-8 md:p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-success/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/20">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-2">MoSJE Citizen</h2>
            <p className="text-blue-100 font-medium">Quick Demo Access</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 md:p-10">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-danger-light border border-danger-light text-danger-dark font-bold text-sm text-center flex items-center justify-center gap-2 animate-in slide-in-from-top-2">
              <ShieldCheck className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2 animate-in slide-in-from-bottom-4" style={{ animationDelay: '50ms', animationFillMode: 'both' }}>
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">
                Applicant Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 text-lg font-black focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all bg-white"
                  placeholder="e.g. Ramesh Kumar"
                />
              </div>
            </div>

            <div className="space-y-2 animate-in slide-in-from-bottom-4" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">
                Mobile Number
              </label>
              <div className="relative flex">
                <div className="flex-shrink-0 flex items-center justify-center px-4 border-2 border-r-0 border-slate-200 rounded-l-xl bg-slate-50 text-slate-500 font-bold">
                  +91
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full px-4 py-4 rounded-r-xl border-2 border-slate-200 text-lg font-black focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all bg-white"
                  placeholder="98765 43210"
                />
              </div>
            </div>

            <div className="space-y-2 animate-in slide-in-from-bottom-4" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">
                Security PIN
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 text-2xl font-black tracking-[0.5em] focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all bg-white"
                  placeholder="****"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-accent hover:bg-accent-hover text-primary font-black text-lg shadow-glow-amber transition-all hover:-translate-y-0.5 mt-8 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? (
                'Verifying...'
              ) : (
                <>
                  Access Citizen Portal
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
