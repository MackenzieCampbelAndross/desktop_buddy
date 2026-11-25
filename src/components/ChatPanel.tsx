import React, { useState, useRef, useEffect } from 'react';
import { useBuddyStore } from '../core/buddy_store';
import { PersonalityEngine } from '../core/personality_engine';
import { Send, Sparkles, Trash2, Bot, User } from 'lucide-react';

export const ChatPanel: React.FC = () => {
  const { chatHistory, sendChatMessage, clearChat, personality, customization } = useBuddyStore();
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const profile = PersonalityEngine.getProfile(personality);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const msg = inputText;
    setInputText('');
    setIsSending(true);
    try {
      await sendChatMessage(msg);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    sendChatMessage(prompt);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col h-[520px] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-900/40 border border-purple-600/40 flex items-center justify-center text-purple-300">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-sm font-bold text-slate-100">{customization.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-500/30">
                {profile.title}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">{profile.tagline}</p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
          title="Clear conversation"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatHistory.map((msg) => {
          const isUser = msg.sender === 'USER';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-purple-900/70 border border-purple-500/40 text-purple-200'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed whitespace-pre-wrap shadow-sm ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/60 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
        <button
          onClick={() => handleQuickPrompt('What do you remember about me?')}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-purple-950/40 border border-slate-700 hover:border-purple-500/40 text-slate-300 hover:text-purple-200 shrink-0 transition-colors"
        >
          🧠 What do you remember?
        </button>
        <button
          onClick={() => handleQuickPrompt("I'm feeling a bit exhausted")}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-purple-950/40 border border-slate-700 hover:border-purple-500/40 text-slate-300 hover:text-purple-200 shrink-0 transition-colors"
        >
          ☕ Feeling tired
        </button>
        <button
          onClick={() => handleQuickPrompt('Tell me a quote or advice')}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-purple-950/40 border border-slate-700 hover:border-purple-500/40 text-slate-300 hover:text-purple-200 shrink-0 transition-colors"
        >
          ✨ Proverb / Quote
        </button>
        <button
          onClick={() => handleQuickPrompt('Let’s do a focus sprint!')}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-purple-950/40 border border-slate-700 hover:border-purple-500/40 text-slate-300 hover:text-purple-200 shrink-0 transition-colors"
        >
          ⚡ Focus Sprint
        </button>
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-3 bg-slate-950/80 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          placeholder={`Chat with ${customization.name}...`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-lg shadow-purple-600/20 active:scale-95 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
