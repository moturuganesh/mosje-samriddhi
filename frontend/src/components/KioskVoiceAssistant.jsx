import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Volume2, VolumeX, X, Sparkles, Bot, User, RotateCcw, MessageSquare, Square } from 'lucide-react';
import { sendChatMessage } from '../api';

export default function KioskVoiceAssistant({
  isActive,
  onClose,
  formData = {},
  evaluationResult = null,
  emiResult = null,
  assignedBranch = null
}) {
  const [lang, setLang] = useState('en');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const accumulatedTranscriptRef = useRef('');

  useEffect(() => {
    const welcomeTexts = {
      'en': 'Hello! I am Samriddhi, your MoSJE/NSFDC AI advisor. Type any query below or tap the microphone to speak continuously.',
      'ta': 'வணக்கம்! நான் சம்ரிதி, உங்கள் MoSJE & TAHDCO நிதியுதவி ஆலோசகர். உங்கள் கேள்வியை கீழே தட்டச்சு செய்யவும் அல்லது மைக்கை அழுத்தி பேசவும்.',
      'hi': 'नमस्ते! मैं समृद्धि हूँ, आपकी MoSJE/NSFDC वित्तीय सलाहकार। आप अपना प्रश्न नीचे लिख सकते हैं या माइक दबाकर बोल सकते हैं।'
    };

    setMessages([
      {
        id: 'welcome-' + lang,
        role: 'model',
        text: welcomeTexts[lang] || welcomeTexts['en'],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        audio_base64: null
      }
    ]);
  }, [lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const playAudioBase64 = (base64Str) => {
    if (!base64Str) return;
    try {
      const audio = new Audio(`data:audio/mp3;base64,${base64Str}`);
      audio.play();
    } catch (e) {
      console.error('Audio playback error:', e);
    }
  };

  // Fixed Speech Recognition: continuous = true, interimResults = true
  const startContinuousListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query in the input box.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const langCodeMap = { 'ta': 'ta-IN', 'hi': 'hi-IN', 'en': 'en-IN' };
      recognition.lang = langCodeMap[lang] || 'en-IN';
      
      // CRITICAL FIX: continuous & interimResults
      recognition.continuous = true;
      recognition.interimResults = true;

      accumulatedTranscriptRef.current = '';
      setLiveTranscript('');
      setIsListening(true);
      setErrorMessage(null);

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';

        for (let i = 0; i < event.results.length; ++i) {
          const transcriptChunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcriptChunk + ' ';
          } else {
            interim += transcriptChunk;
          }
        }

        const currentFull = (final + interim).trim();
        accumulatedTranscriptRef.current = currentFull;
        setLiveTranscript(currentFull);
      };

      recognition.onerror = (err) => {
        console.error('Speech recognition error:', err);
        if (err.error !== 'no-speech') {
          setErrorMessage(`Microphone notice: ${err.error}`);
        }
      };

      recognition.onend = () => {
        // Recognition completed
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  const stopListeningAndSend = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);

    const spokenText = accumulatedTranscriptRef.current.trim() || liveTranscript.trim();
    setLiveTranscript('');
    accumulatedTranscriptRef.current = '';

    if (spokenText) {
      handleSendMessage(spokenText);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const msg = textToSend !== undefined ? textToSend : inputText;
    if (!msg || !msg.trim() || loading) return;

    const trimmedMsg = msg.trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessageObj = {
      id: Date.now().toString(),
      role: 'user',
      text: trimmedMsg,
      time: timeStr
    };

    const updated = [...messages, userMessageObj];
    setMessages(updated);
    setInputText('');
    setLoading(true);
    setErrorMessage(null);

    const historyPayload = updated
      .filter((m) => !m.id.startsWith('welcome-'))
      .map((m) => ({ role: m.role, text: m.text }));

    const appState = {
      applicant_name: formData?.applicant_name || 'Beneficiary',
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
        message: trimmedMsg,
        language: lang,
        history: historyPayload,
        app_state: appState
      });

      const replyText = res.reply_text || 'Response received.';
      const replyMsg = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: replyText,
        audio_base64: res.audio_base64,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, replyMsg]);
      if (res.audio_base64) {
        playAudioBase64(res.audio_base64);
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errDetail = err.response?.data?.detail || err.message || 'Server error occurred.';
      setErrorMessage(errDetail);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: `Error: ${errDetail}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-slate-900 text-white rounded-3xl shadow-2xl border-2 border-amber-400/80 overflow-hidden flex flex-col h-[580px] animate-in fade-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-black text-amber-300">Samriddhi Voice/Chat</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              Continuous Mic &amp; gTTS Native Voice
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setMessages([])}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
            title="Reset Chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (recognitionRef.current) recognitionRef.current.stop();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Language Switcher */}
      <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Language:
        </span>
        <div className="flex gap-1.5">
          {[
            { code: 'en', label: 'English' },
            { code: 'ta', label: 'தமிழ்' },
            { code: 'hi', label: 'हिन्दी' }
          ].map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                lang === l.code
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950'
              }`}
            >
              {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 shadow-sm space-y-1.5 ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-800 border border-slate-700 text-slate-100 rounded-tl-none'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
              <div className="flex items-center justify-between text-[10px] opacity-60 pt-0.5">
                <span>{m.time}</span>
                {m.audio_base64 && (
                  <button
                    onClick={() => playAudioBase64(m.audio_base64)}
                    className="hover:opacity-100 text-amber-300 flex items-center gap-1 font-semibold"
                    title="Play Audio"
                  >
                    <Volume2 className="w-3 h-3" /> Replay
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-2 px-3 bg-slate-800/50 rounded-xl w-fit border border-slate-700/50">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"></span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]"></span>
            <span className="text-[11px] font-medium text-slate-300 ml-1">Samriddhi AI thinking...</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-700 text-rose-300 text-[11px]">
            {errorMessage}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Live Continuous Speech Transcription Bar */}
      {isListening && (
        <div className="p-3 bg-rose-950/90 border-t border-rose-800 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-rose-300 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              Listening continuously... Speak freely
            </span>
            <button
              type="button"
              onClick={stopListeningAndSend}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-[11px] shadow"
            >
              Stop &amp; Send
            </button>
          </div>
          {liveTranscript && (
            <p className="text-[11px] text-slate-200 bg-slate-900/90 p-2 rounded-lg border border-slate-700 italic">
              "{liveTranscript}"
            </p>
          )}
        </div>
      )}

      {/* Input Form with explicit binding to inputText */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
      >
        <button
          type="button"
          onClick={isListening ? stopListeningAndSend : startContinuousListening}
          className={`p-2.5 rounded-xl font-bold transition-all shadow-md flex-shrink-0 ${
            isListening
              ? 'bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-500/40 animate-pulse'
              : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
          }`}
          title={isListening ? 'Stop Listening & Send' : 'Speak continuously'}
        >
          {isListening ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={lang === 'ta' ? 'கேள்வி தட்டச்சு செய்க...' : lang === 'hi' ? 'यहाँ प्रश्न लिखें...' : 'Type your question...'}
          className="flex-1 bg-slate-800 border border-slate-700 focus:border-amber-400 text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none placeholder-slate-500 font-medium"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || loading}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold transition-all flex-shrink-0 shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

