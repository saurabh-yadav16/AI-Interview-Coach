import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, Zap, Copy, Check } from 'lucide-react';
import { askTutorApi } from '../services/api';

const AIAssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'ai',
      text: "👋 Welcome! I am your AI Interview Tutor & Concept Assistant.\n\nAsk me anything about system design, coding algorithms, STAR behavioral framework, or technical interview concepts!",
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const chatEndRef = useRef(null);

  const suggestedPrompts = [
    "Explain JWT Authentication & security best practices",
    "How do I structure a STAR method behavioral answer?",
    "Compare SQL Indexes vs NoSQL MongoDB Aggregation",
    "What are React custom hooks and why use them?",
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || isTyping) return;

    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const res = await askTutorApi({ prompt: query });
      if (res.success && res.answer) {
        const aiMsg = {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: res.answer,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error('Tutor ask error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 bg-white min-h-[calc(100vh-4rem)]">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="mint-pill">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>Interactive AI Concept Tutor</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">AI Learning Assistant & Concept Coach</h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto font-medium">
          Get instant expert explanations for system design, algorithms, resume framing, and interview frameworks.
        </p>
      </div>

      {/* Suggested Quick Topics */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/80 text-xs font-bold text-emerald-800 transition-all flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-700" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Main Chat Box */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xl shadow-emerald-900/5 h-[520px] flex flex-col justify-between relative">
        {/* Message Feed */}
        <div className="overflow-y-auto space-y-4 pr-2 flex-1">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.sender === 'ai' && (
                <div className="w-9 h-9 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div className="space-y-1 max-w-[82%] relative group">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-emerald-700 text-white rounded-br-none'
                      : 'bg-slate-50 border border-slate-200 text-slate-900 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>

                {m.sender === 'ai' && (
                  <button
                    onClick={() => copyToClipboard(m.text, m.id)}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 bg-white/80 rounded-md border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy Answer"
                  >
                    {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}

                <div className={`text-[10px] text-slate-400 font-bold px-1 ${m.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {m.time}
                </div>
              </div>
            </div>
          ))}

          {/* AI Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-3 justify-start">
              <div className="w-9 h-9 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-slate-50 border border-slate-200 text-slate-600 p-4 rounded-2xl rounded-bl-none flex items-center gap-2 text-xs font-bold">
                <span>AI Tutor is formulating response...</span>
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Form Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="pt-4 border-t border-slate-100 flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI Tutor e.g. How to explain MongoDB indexing in interviews..."
            className="flex-1 px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="emerald-button px-6 py-3.5 text-sm font-bold disabled:opacity-50"
          >
            <span>Ask AI</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistantPage;
