import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, X, Sparkles, Building2, User, Landmark, ShieldCheck } from 'lucide-react';
import { sendChatMessage } from '../api';

export default function AudioKioskOverlay({
  isOpen,
  onClose,
  formData = {},
  evaluationResult = null,
  emiResult = null,
  assignedBranch = null
}) {
  const [lang, setLang] = useState('ta'); // Default to Tamil for TN
  const [status, setStatus] = useState('idle'); // 'idle' | 'listening' | 'processing' | 'speaking'
  const [userTranscript, setUserTranscript] = useState('');
  const [aiReply, setAiReply] = useState('');
  const recognitionRef = useRef(null);
  const audioInstanceRef = useRef(null);

  const langCodeSpeech = lang === 'ta' ? 'ta-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';

  useEffect(() => {
    if (!isOpen) {
      stopAllAudio();
      recognitionRef.current?.stop();
    }
  }, [isOpen]);

  const stopAllAudio = () => {
    if (audioInstanceRef.current) {
      audioInstanceRef.current.pause();
      audioInstanceRef.current.currentTime = 0;
      audioInstanceRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setStatus('idle');
  };

  const playServerAudio = (base64Audio) => {
    if (!base64Audio) {
      setStatus('idle');
      return;
    }
    try {
      stopAllAudio();
      setStatus('speaking');
      const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
      audioInstanceRef.current = audio;
      audio.onended = () => {
        setStatus('idle');
      };
      audio.onerror = (e) => {
        console.error('Server Audio Playback Error:', e);
        setStatus('idle');
      };
      audio.play().catch((err) => {
        console.error('Audio Play Error:', err);
        setStatus('idle');
      });
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  const startVoiceInteraction = () => {
    stopAllAudio();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = langCodeSpeech;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setStatus('listening');
        setUserTranscript('');
      };

      recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        setUserTranscript(transcript);
        setStatus('processing');
        await handleProcessVoiceQuery(transcript);
      };

      recognition.onerror = (err) => {
        console.error('Speech error:', err);
        setStatus('idle');
      };

      recognition.onend = () => {
        if (status === 'listening') {
          setStatus('idle');
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  const handleProcessVoiceQuery = async (spokenText) => {
    const appState = {
      applicant_name: formData?.applicant_name || 'Priyadarshini M',
      annual_family_income: formData?.annual_family_income || 180000,
      gender: formData?.gender || 'F',
      category: formData?.category || 'SC',
      district: formData?.district || 'Chengalpattu',
      state: formData?.state || 'Tamil Nadu',
      project_cost: formData?.project_cost || 100000,
      scheme_name: evaluationResult?.primary_recommended_scheme?.scheme_name || 'Mahila Samriddhi Yojana (MSY)',
      interest_rate_pct: evaluationResult?.primary_recommended_scheme?.interest_rate_pct || 4.0,
      loan_amount: evaluationResult?.primary_recommended_scheme?.loan_amount || 90000,
      moratorium_months: emiResult?.moratorium_months || 3,
      monthly_emi: emiResult?.monthly_emi_post_moratorium || 3221,
      recommended_branch: assignedBranch || {
        name: 'Indian Bank - Kalavakkam SME Specialized Branch',
        distance_km: 0.0,
        npa_percentage: 1.8
      }
    };

    try {
      const res = await sendChatMessage({
        message: spokenText,
        language: lang,
        history: [],
        app_state: appState
      });

      setAiReply(res.reply_text || res.response || '');
      playServerAudio(res.audio_base64);
    } catch (err) {
      console.error('Voice query error:', err);
      setStatus('idle');
      setAiReply(
        lang === 'ta'
          ? 'மன்னிக்கவும், தகவலைப் பெறுவதில் சிக்கல் ஏற்பட்டது. மீண்டும் மைக் அழுத்தவும்.'
          : lang === 'hi'
          ? 'क्षमा करें, जानकारी प्राप्त करने में समस्या हुई। कृपया पुनः प्रयास करें।'
          : 'Could not process audio. Please try again.'
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-amber-400/90 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-white text-center relative overflow-hidden">
        {/* Top bar */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping"></span>
            <h2 className="text-lg font-black text-amber-300 uppercase tracking-wider">
              Rural Audio Kiosk Assistant (gTTS Native Voice)
            </h2>
          </div>

          <button
            onClick={() => {
              stopAllAudio();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Selection */}
        <div className="flex justify-center items-center gap-2">
          {[
            { code: 'ta', label: 'தமிழ் (Tamil Native)' },
            { code: 'hi', label: 'हिन्दी (Hindi Native)' },
            { code: 'en', label: 'English (Indian Accent)' }
          ].map((l) => (
            <button
              key={l.code}
              onClick={() => {
                stopAllAudio();
                setLang(l.code);
              }}
              className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all shadow ${
                lang === l.code
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 scale-105'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Central Massive Microphone */}
        <div className="py-6 flex flex-col items-center justify-center space-y-4">
          <button
            onClick={status === 'listening' ? () => recognitionRef.current?.stop() : startVoiceInteraction}
            className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full flex flex-col items-center justify-center font-black transition-all shadow-2xl ${
              status === 'listening'
                ? 'bg-rose-600 text-white ring-8 ring-rose-500/40 animate-pulse scale-105'
                : status === 'processing'
                ? 'bg-amber-500 text-slate-950 animate-bounce'
                : status === 'speaking'
                ? 'bg-emerald-500 text-white ring-8 ring-emerald-400/40 animate-pulse'
                : 'bg-gradient-to-tr from-amber-400 to-amber-300 text-slate-950 hover:scale-105 hover:shadow-amber-400/30'
            }`}
          >
            <Mic className="w-12 h-12 sm:w-16 sm:h-16 mb-1" />
            <span className="text-[11px] uppercase tracking-wider font-extrabold">
              {status === 'listening'
                ? 'Listening...'
                : status === 'processing'
                ? 'Thinking...'
                : status === 'speaking'
                ? 'Speaking...'
                : 'Tap to Speak'}
            </span>
          </button>

          <p className="text-xs text-slate-400 font-medium">
            {lang === 'ta'
              ? 'மைக்கை அழுத்தி தமிழில் பேசவும். மொரட்டோரியம், வங்கி கிளை அல்லது வட்டி பற்றி கேட்கலாம்.'
              : lang === 'hi'
              ? 'माइक दबाकर बोलें। योजना, मोरेटोरियम या बैंक शाखा के बारे में पूछें।'
              : 'Tap the mic and ask: "Where should I go for my loan?" or "Explain the moratorium."'}
          </p>
        </div>

        {/* Live Transcript & AI Reply Visualizer */}
        <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 space-y-3 text-left min-h-[140px]">
          {userTranscript && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">You Spoke:</span>
              <p className="text-sm font-semibold text-slate-200 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                "{userTranscript}"
              </p>
            </div>
          )}

          {aiReply ? (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Samriddhi AI Audio Output:
              </span>
              <p className="text-sm font-bold text-emerald-300 leading-relaxed bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/60">
                {aiReply}
              </p>
            </div>
          ) : (
            !userTranscript && (
              <div className="text-center py-6 text-slate-500 text-xs italic">
                State-aware voice agent loaded with your profile (Indian Bank Kalavakkam, 4% MSY Rate, ₹90,000 Loan). Tap the microphone to begin.
              </div>
            )
          )}
        </div>

        {/* Footer Info */}
        <div className="pt-2 flex justify-between items-center text-[11px] text-slate-400 border-t border-slate-800">
          <span className="flex items-center gap-1 text-amber-400 font-semibold">
            <ShieldCheck className="w-4 h-4" /> Native Server-Side gTTS Enabled
          </span>
          <button
            onClick={stopAllAudio}
            className="hover:text-white font-bold underline"
          >
            Stop Audio Playback
          </button>
        </div>
      </div>
    </div>
  );
}
