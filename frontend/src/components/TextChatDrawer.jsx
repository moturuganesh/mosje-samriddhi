import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Bot, User, RotateCcw, Volume2, Sparkles, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';
import { sendChatMessage, fetchTTS } from '../api';

const QUICK_PROMPTS = {
  'en': [
    'What is my recommended scheme and interest rate?',
    'Explain the 3-month moratorium period',
    'Where should I go to get my loan?',
    'What is my monthly EMI after moratorium?',
    'Summarize my profile'
  ],
  'ta': [
    'எனக்கான பரிந்துரைக்கப்பட்ட திட்டம் என்ன?',
    'மோரடோரியம் என்றால் என்ன?',
    'என் கடனை எங்கு பெறுவது?',
    'எனது மாத EMI என்ன?'
  ],
  'hi': [
    'मेरा अनुशंसित योजना क्या है?',
    'मोरटोरियम का मतलब क्या है?',
    'मेरा मासिक EMI क्या होगा?',
    'मुझे अपना लोन कहाँ मिलेगा?'
  ]
};

const welcomeTexts = {
  'en': "Hello! I am **Samriddhi**, your AI advisor. How can I assist you with your MoSJE/NSFDC application today?",
  'ta': "வணக்கம்! நான் சம்ருத்தி. உங்கள்MoSJE/NSFDC விண்ணப்பத்திற்கு நான் எவ்வாறு உதவ முடியும்?",
  'hi': "नमस्ते! मैं समृद्धि हूँ। मैं आपकी MoSJE/NSFDC आवेदन में कैसे मदद कर सकती हूँ?"
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
  const [errorMessage, setErrorMessage] = useState(null);
  const [audioLoading, setAudioLoading] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    let welcomeMsg = welcomeTexts[lang] || welcomeTexts['en'];
    if (!formData || !formData.applicant_name) {
      if (lang === 'ta') {
        welcomeMsg = "வணக்கம்! நான் **சம்ருத்தி**, உங்கள் AI வழிகாட்டி. உங்கள் கடன் மற்றும் EMI பற்றிய தகவல்களைப் பெற, முதலில் உங்கள் விண்ணப்பத்தை நிரப்பவும் அல்லது லாகின் செய்யவும்.";
      } else if (lang === 'hi') {
        welcomeMsg = "नमस्ते! मैं **समृद्धि** हूँ, आपका AI सलाहकार। अपने लोन और EMI के बारे में जानकारी प्राप्त करने के लिए, कृपया अपना आवेदन पूरा करें या लॉग इन करें।";
      } else {
        welcomeMsg = "Hello! I am **Samriddhi**, your AI advisor. To get personalized insights about your loan and EMI, please complete your application or log in first.";
      }
    }

    setMessages([
      {
        id: 'welcome-' + Date.now(),
        role: 'model',
        text: welcomeMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [lang, formData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, errorMessage]);

  const handlePlayAudio = async (msgId, text) => {
    if (!text) return;
    setAudioLoading(msgId);
    try {
      const audioBase64 = await fetchTTS(text, lang);
      if (audioBase64) {
        const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
        audio.play();
      }
    } catch (e) {
      console.error('Audio playback error:', e);
    } finally {
      setAudioLoading(null);
    }
  };

  const handleSend = async (userMsg) => {
    const textToSend = userMsg || inputText;
    if (!textToSend?.trim() || loading) return;

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

    if (!formData || !formData.applicant_name) {
      setTimeout(() => {
        let authErr = "I need access to your application records to assist you further. Please complete your application or log in first!";
        if (lang === 'ta') authErr = "உங்களுக்கு உதவ உங்கள் விண்ணப்ப விவரங்கள் எனக்குத் தேவை. தயவுசெய்து உங்கள் விண்ணப்பத்தை முதலில் நிரப்பவும்!";
        if (lang === 'hi') authErr = "आपकी सहायता करने के लिए मुझे आपके आवेदन रिकॉर्ड की आवश्यकता है। कृपया पहले अपना आवेदन पूरा करें!";
        
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: authErr,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setLoading(false);
      }, 600);
      return;
    }

    const historyPayload = updated
      .filter((m) => !m.id.startsWith('welcome-'))
      .map((m) => ({ role: m.role, text: m.text }));

    const appState = {
      applicant_name: formData.applicant_name,
      annual_family_income: formData.annual_family_income || 180000,
      gender: formData.gender || 'F',
      category: formData.category || 'SC',
      district: formData.district || 'Chengalpattu',
      state: formData.state || 'Tamil Nadu',
      project_cost: formData.project_cost || 100000,
      scheme_name: evaluationResult?.primary_recommended_scheme?.scheme_name || 'Mahila Samriddhi Yojana (MSY)',
      interest_rate_pct: evaluationResult?.primary_recommended_scheme?.interest_rate_pct || 4.0,
      loan_amount: evaluationResult?.primary_recommended_scheme?.loan_amount || 90000,
      promoter_contribution: 10000,
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
        app_state: appState,
        generate_audio: false // Split TTS logic to dramatically reduce LLM text chat latency
      });

      const replyMsg = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: res.reply_text || res.response || 'I am happy to assist you.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, replyMsg]);
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail || 'Unable to connect to the advisor service. Please try again.';
      setErrorMessage(detail);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[500px] max-w-full bg-slate-900 text-white rounded-t-3xl sm:rounded-b-3xl shadow-2xl border-t-2 sm:border-2 border-slate-700 overflow-hidden flex flex-col h-[85vh] sm:h-[80vh] min-h-[500px] animate-in fade-in slide-in-from-bottom-4 duration-200">
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
            { code: 'hi', label: 'हिंदी' }
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
              className={`max-w-[85%] rounded-2xl px-5 py-3.5 shadow-md space-y-1.5 ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-slate-800 border border-slate-700 text-slate-100 rounded-bl-sm'
              }`}
            >
              <div className="leading-relaxed text-[15px] prose prose-sm prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-strong:text-amber-100 prose-strong:font-bold prose-p:text-slate-100 prose-li:text-slate-100">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
              </div>
              <div className="flex items-center justify-between text-xs opacity-70 pt-2 border-t border-slate-700/50 mt-2">
                <span>{m.time}</span>
                {m.role === 'model' && (
                  <button
                    onClick={() => handlePlayAudio(m.id, m.text)}
                    disabled={audioLoading === m.id}
                    className="hover:opacity-100 text-blue-200 flex items-center gap-1 font-bold disabled:opacity-50"
                    title="Listen to native audio"
                  >
                    {audioLoading === m.id ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading...</>
                    ) : (
                      <><Volume2 className="w-3.5 h-3.5" /> Listen</>
                    )}
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
      <div className="px-5 py-3 bg-slate-950/80 border-t border-slate-800 flex gap-2 overflow-x-auto styled-scrollbar">
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
          placeholder={lang === 'ta' ? 'கேள்வியை இங்கே தட்டச்சு செய்க...' : lang === 'hi' ? 'अपना प्रश्न यहां टाइप करें...' : 'Type your question here...'}
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
