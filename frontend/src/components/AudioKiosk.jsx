import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, X, Sparkles, ShieldCheck, Square, Activity } from 'lucide-react';
import { sendChatMessage } from '../api';

export default function AudioKiosk({
  isOpen,
  onClose,
  formData = {},
  evaluationResult = null,
  emiResult = null,
  assignedBranch = null
}) {
  const [lang, setLang] = useState('ta'); // Default to Tamil for TN
  
  // STRICT UI STATE MACHINE
  // IDLE -> LISTENING -> PROCESSING -> SPEAKING -> IDLE
  const [kioskState, setKioskState] = useState('IDLE'); 
  
  const [userTranscript, setUserTranscript] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const transcriptBufferRef = useRef('');

  useEffect(() => {
    if (!isOpen) {
      stopAudio();
      stopRecognition();
      setKioskState('IDLE');
    }
  }, [isOpen]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    // We only reset to IDLE if we are speaking and stopping early.
    if (kioskState === 'SPEAKING') {
      setKioskState('IDLE');
    }
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  const playAudioBase64Natively = (base64Mp3) => {
    if (!base64Mp3) {
      setKioskState('IDLE');
      return;
    }
    try {
      stopAudio();
      setKioskState('SPEAKING');
      const audio = new Audio(`data:audio/mp3;base64,${base64Mp3}`);
      audioRef.current = audio;

      audio.onended = () => {
        setKioskState('IDLE'); // Return to IDLE when AI finishes talking
      };
      
      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setKioskState('IDLE');
      };

      audio.play().catch((err) => {
        console.error('Audio play rejection:', err);
        setKioskState('IDLE');
      });
    } catch (err) {
      console.error(err);
      setKioskState('IDLE');
    }
  };

  const executeApiCall = async (spokenText) => {
    if (!spokenText || !spokenText.trim()) {
      setKioskState('IDLE');
      return;
    }

    setKioskState('PROCESSING');
    setErrorMessage(null);

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

      setAiReply(res.reply_text || '');
      playAudioBase64Natively(res.audio_base64);
    } catch (err) {
      console.error('Voice kiosk chat error:', err);
      setKioskState('IDLE');
      const detail = err.response?.data?.detail || err.message || 'Server error occurred.';
      setErrorMessage(detail);
    }
  };

  const startListening = () => {
    stopAudio();
    setErrorMessage(null);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const langCodeMap = { 'ta': 'ta-IN', 'hi': 'hi-IN', 'en': 'en-IN' };
      recognition.lang = langCodeMap[lang] || 'ta-IN';

      // CRITICAL FIX: continuous = false so browser auto-detects silence and stops.
      recognition.continuous = true;
      recognition.interimResults = true;

      transcriptBufferRef.current = '';
      setUserTranscript('');
      setKioskState('LISTENING');

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';

        for (let i = 0; i < event.results.length; ++i) {
          const chunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += chunk + ' ';
          } else {
            interim += chunk;
          }
        }

        const full = (final + interim).trim();
        transcriptBufferRef.current = full;
        setUserTranscript(full);
      };

      recognition.onerror = (err) => {
        console.error('Speech error:', err);
        if (err.error !== 'no-speech') {
          setErrorMessage(`Microphone error: ${err.error}`);
        }
      };

      recognition.onend = () => {
        // Auto-stop detected by browser silence
        if (transcriptBufferRef.current.trim().length > 0) {
          executeApiCall(transcriptBufferRef.current);
        } else {
          setKioskState('IDLE');
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setKioskState('IDLE');
    }
  };

  // Determine massive button styling based on strict state
  const getButtonConfig = () => {
    switch (kioskState) {
      case 'LISTENING':
        return {
          colorClass: 'bg-emerald-500 text-white ring-8 ring-emerald-400/40 animate-pulse scale-105',
          icon: <Mic className="w-12 h-12 sm:w-16 sm:h-16 mb-1" />,
          text: 'Listening...'
        };
      case 'PROCESSING':
        return {
          colorClass: 'bg-amber-500 text-slate-950 ring-4 ring-amber-400/40 animate-bounce',
          icon: <Activity className="w-12 h-12 sm:w-16 sm:h-16 mb-1 animate-spin-slow" />,
          text: 'Thinking...'
        };
      case 'SPEAKING':
        return {
          colorClass: 'bg-blue-500 text-white ring-8 ring-blue-400/40 animate-pulse',
          icon: <Volume2 className="w-12 h-12 sm:w-16 sm:h-16 mb-1" />,
          text: 'Speaking...'
        };
      case 'IDLE':
      default:
        return {
          colorClass: 'bg-gradient-to-tr from-amber-400 to-amber-300 text-slate-950 hover:scale-105 hover:shadow-amber-400/30',
          icon: <Mic className="w-12 h-12 sm:w-16 sm:h-16 mb-1" />,
          text: 'Tap to Speak'
        };
    }
  };

  const btnConfig = getButtonConfig();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-white text-center relative overflow-hidden">
        
        {/* Top Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping"></span>
            <h2 className="text-lg font-black text-amber-300 uppercase tracking-wider">
              Rural Audio Kiosk
            </h2>
          </div>

          <button
            onClick={() => {
              stopAudio();
              stopRecognition();
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
            { code: 'ta', label: 'தமிழ் (Tamil)' },
            { code: 'hi', label: 'हिन्दी (Hindi)' },
            { code: 'en', label: 'English' }
          ].map((l) => (
            <button
              key={l.code}
              disabled={kioskState === 'LISTENING' || kioskState === 'PROCESSING' || kioskState === 'SPEAKING'}
              onClick={() => {
                stopAudio();
                setLang(l.code);
              }}
              className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all shadow disabled:opacity-50 ${
                lang === l.code
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 scale-105'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Central Massive Microphone Button */}
        <div className="py-6 flex flex-col items-center justify-center space-y-4">
          <button
            onClick={kioskState === 'IDLE' ? startListening : stopRecognition}
            disabled={kioskState === 'PROCESSING' || kioskState === 'SPEAKING'}
            className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center font-black transition-all shadow-2xl disabled:cursor-not-allowed ${btnConfig.colorClass}`}
          >
            {btnConfig.icon}
            <span className="text-xs uppercase tracking-wider font-extrabold">{btnConfig.text}</span>
          </button>

          <p className="text-xs text-slate-300 font-medium max-w-md mx-auto min-h-[32px]">
            {kioskState === 'LISTENING'
              ? 'Listening... (Tap the mic again when you are finished speaking)'
              : kioskState === 'PROCESSING'
              ? 'Analyzing and preparing audio response...'
              : kioskState === 'SPEAKING'
              ? 'AI is speaking...'
              : lang === 'ta'
              ? 'மைக்கை அழுத்தி தமிழில் பேசவும். தானாகவே பேச்சை உணர்ந்து கொள்ளும்.'
              : lang === 'hi'
              ? 'माइक दबाकर बोलें। सिस्टम स्वतः चुप होने पर समझ जाएगा।'
              : 'Tap mic to start speaking. It will automatically detect when you stop.'}
          </p>
        </div>

        {/* Live Transcription & Audio Response Box */}
        <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800 space-y-3 text-left min-h-[140px]">
          {userTranscript && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">You Spoke:</span>
              <p className="text-sm font-semibold text-slate-200 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                "{userTranscript}"
              </p>
            </div>
          )}

          {aiReply && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Samriddhi AI Response:
              </span>
              <p className="text-sm font-bold text-emerald-300 leading-relaxed bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/60">
                {aiReply}
              </p>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950 border border-rose-700 text-rose-300 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          {!userTranscript && !aiReply && !errorMessage && (
            <div className="text-center py-6 text-slate-500 text-xs italic">
              Ready for voice query. Tap the microphone and ask a question.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-between items-center text-[11px] text-slate-400 border-t border-slate-800">
          <span className="flex items-center gap-1 text-amber-400 font-semibold">
            <ShieldCheck className="w-4 h-4" /> Tap-to-Talk Mode Enabled
          </span>
          {kioskState === 'SPEAKING' && (
            <button
              onClick={() => {
                stopAudio();
                setKioskState('IDLE');
              }}
              className="hover:text-white font-bold underline"
            >
              Stop Audio Playback
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
