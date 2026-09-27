import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Bot, User, RotateCcw, Volume2, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import { sendChatMessage } from '../api';

const QUICK_PROMPTS = {
  'en': [
    'What is my recommended scheme and interest rate?',
    'Explain the 3-month moratorium period',
    'Where should I go to get my loan?',
    'What is my monthly EMI after moratorium?'
  ],
  'ta': [
    'எனக்கு ஒதுக்கப்பட்ட வங்கி கிளை எது?',
    'மகளிர் சம்ரிதி 4% வட்டி விபரம் கூறுங்கள்',
    'மொரட்டோரியம் காலத்தில் தவணை செலுத்த வேண்டுமா?',
    'எனது மாத EMI எவ்வளவு?'
  ],
  'hi': [
    'मुझे अपना ऋण लेने किस बैंक शाखा जाना होगा?',
    'महिला समृद्धि 4% ब्याज दर कैसे काम करती है?',
    'मोरेटोरियम के बाद मेरी मासिक EMI कितनी होगी?',
    'ऋण स्वीकृति के लिए कौन से दस्तावेज चाहिए?'
  ]
};

export default function TextChatDrawer({
  isOpen,
  onClose,
  formData = {},
  evaluationResult = null,
  emiResult = null,
  assignedBranch = null
}) {
  const [lang, setLang] = useState('en');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null); // Dedicated error state
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const welcomeTexts = {
      'en': 'Hello! I am Samriddhi, your MoSJE/NSFDC text advisor. Ask me anything about your matched loan schemes, moratorium benefits, or assigned bank branch.',
      'ta': 'வணக்கம்! நான் சம்ரிதி, உங்கள் MoSJE & TAHDCO நிதியுதவி ஆலோசகர். உங்கள் கடன் திட்டம், வட்டி விகிதம் அல்லது ஒதுக்கப்பட்ட வங்கி கிளை பற்றி இங்கே கேட்கலாம்.',
      'hi': 'नमस्ते! मैं समृद्धि हूँ, आपकी MoSJE/NSFDC वित्तीय सलाहकार। आप अपनी योजना, ब्याज दर या बैंक शाखा से संबंधित कोई भी प्रश्न यहाँ पूछ सकते हैं।'
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
  }, [messages, loading, errorMessage]);

  const handlePlayAudio = (audioBase64) => {
    if (!audioBase64) return;
    try {
      const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
      audio.play();
    } catch (e) {
      console.error('Audio playback error:', e);
    }
  };

  const handleSend = async (userMsg) => {
    const textToSend = userMsg || inputText;
    if (!textToSend?.trim() || loading) return;

    // Clear previous errors instantly (Fixes Ghost Text stacking)
    setErrorMessage(null);

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessageObj = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      time: timeStr
    };

    const updated = [...messages, userMessageObj];
    setMessages(updated);
    setInputText('');
    setLoading(true);

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
        message: textToSend,
        language: lang,
        history: historyPayload,
        app_state: appState
      });

      const replyMsg = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: res.reply_text || res.response || 'I am happy to assist you.',
        audio_base64: res.audio_base64,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, replyMsg]);
    } catch (err) {
      console.error(err);
      // Display graceful error above input rather than as a permanent chat bubble
      const detail = err.response?.data?.detail || 'Unable to connect to the advisor service. Please try again.';
      setErrorMessage(detail);
      
      // Optionally remove the user message if it failed, but keeping it is usually better UX
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full md:w-[500px] max-w-full bg-slate-900 text-white rounded-3xl shadow-2xl border-2 border-slate-700 overflow-hidden flex flex-col h-[80vh] min-h-[500px] animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Header */}
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
              Samriddhi Text AI
              <span className="text-xs bg-blue-900/80 text-blue-300 px-2 py-0.5 rounded font-bold">State-Aware</span>
            </h3>
            <p className="text-xs text-slate-400 font-medium">Silent Text Chat</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setMessages([]);
              setErrorMessage(null);
            }}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 text-sm transition"
            title="Reset Chat"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-rose-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Language Bar */}
      <div className="bg-slate-900/90 px-6 py-2.5 border-b border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-blue-400" /> Language:
        </span>
        <div className="flex gap-2">
          {[
            { code: 'en', label: 'English' },
            { code: 'ta', label: 'தமிழ்' },
            { code: 'hi', label: 'हिन्दी' }
          ].map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code);
                setErrorMessage(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                lang === l.code
                  ? 'bg-blue-600 text-white shadow-md scale-105'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-end gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold shadow-md ${
                m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-amber-300 border border-slate-700'
              }`}
            >
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl px-5 py-3.5 shadow-md space-y-1.5 ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-slate-800 border border-slate-700 text-slate-100 rounded-bl-sm'
              }`}
            >
              <div className="leading-relaxed text-[15px] prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-strong:text-current">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
                </div>
              <div className="flex items-center justify-between text-xs opacity-70 pt-1">
                <span>{m.time}</span>
                {m.audio_base64 && (
                  <button
                    onClick={() => handlePlayAudio(m.audio_base64)}
                    className="hover:opacity-100 text-blue-200 flex items-center gap-1 font-bold"
                    title="Listen to native audio"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Listen
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2.5 text-slate-400 text-sm py-3 px-4 bg-slate-800/60 rounded-2xl rounded-bl-sm w-fit border border-slate-700 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-bounce"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]"></span>
            <span className="font-semibold text-slate-300 ml-1">Consulting AI...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-5 py-3 bg-slate-950/80 border-t border-slate-800 flex gap-2 overflow-x-auto no-scrollbar">
        {(QUICK_PROMPTS[lang] || QUICK_PROMPTS['en']).map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            className="whitespace-nowrap px-3.5 py-2 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-blue-300 hover:text-white transition-all flex-shrink-0 shadow-sm"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Error Message Display */}
      {errorMessage && (
        <div className="px-5 py-2.5 bg-rose-950/80 border-t border-rose-900 flex items-center gap-2 text-rose-300 text-sm font-semibold">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="flex-1 leading-snug">{errorMessage}</p>
          <button onClick={() => setErrorMessage(null)} className="p-1 hover:text-rose-100"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={lang === 'ta' ? 'உங்கள் கேள்வியைத் தட்டச்சு செய்க...' : lang === 'hi' ? 'अपना प्रश्न यहाँ लिखें...' : 'Type your question here...'}
          className="flex-1 bg-slate-800 border-2 border-slate-700 focus:border-blue-500 text-sm text-white rounded-xl px-4 py-3.5 focus:outline-none placeholder-slate-400 font-medium transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || loading}
          className="p-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black transition-all shadow-lg"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

