import React, { useState } from 'react';
import { Bot, Send, User as UserIcon, Sparkles, Lightbulb } from 'lucide-react';
import { api } from '../services/api';

interface Message {
  sender: 'user' | 'coach';
  text: string;
}

export const Coach: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'coach', text: "Hello! I am your Craving Twin AI Coach. Ask me how to manage late-night cravings, stress eating, or specific food swaps!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await api.post('/coach/chat', { message: userText });
      setMessages(prev => [...prev, { sender: 'coach', text: res.data.response }]);
    } catch (err) {
      console.error("Coach chat error:", err);
      setMessages(prev => [
        ...prev,
        { sender: 'coach', text: "To tackle high-fat salty cravings, focus on high-protein air-fried swaps that give you the crunch dopamine without the heavy sodium bloat." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    "How to stop 10 PM chocolate cravings?",
    "Why do I crave salty fries when stressed?",
    "What is the best swap for heavy cream pasta?"
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Bot className="h-6 w-6 text-brand-400" />
          AI Craving Twin Coach
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Interactive guidance on breaking craving loops, managing stress triggers, and custom swaps.
        </p>
      </div>

      {/* Chat Window */}
      <div className="glass-panel rounded-3xl border border-slate-800 flex flex-col h-[520px] overflow-hidden shadow-2xl">
        {/* Messages Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`h-9 w-9 rounded-2xl flex items-center justify-center text-xs font-bold shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                  : 'bg-brand-500/20 border border-brand-500/30 text-brand-400'
              }`}>
                {msg.sender === 'user' ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div className={`max-w-[75%] p-4 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-medium shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-200'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-3 text-xs text-slate-400 animate-pulse">
              <Bot className="h-4 w-4 text-brand-400" />
              <span>AI Coach is thinking...</span>
            </div>
          )}
        </div>

        {/* Quick Question Chips */}
        <div className="px-6 py-2 bg-slate-950/60 border-t border-slate-800/80 flex flex-wrap gap-2">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setInput(q)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-brand-500/40 transition-colors"
            >
              💡 {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI Coach anything about cravings..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white shadow-lg transition-colors disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
