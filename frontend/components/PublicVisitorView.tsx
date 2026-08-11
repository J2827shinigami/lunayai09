import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Globe, ArrowLeft, Send, Sparkles, RefreshCw, Copy, Check, Moon } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { sendMessageStream } from '../services/geminiService';
import { PERSONAS } from '../constants';

interface PublicVisitorViewProps {
  onBackToDashboard: () => void;
}

const PUBLIC_SAMPLE_PROMPTS = [
  "What is Luna AI and how can it assist me daily?",
  "How do persistent memory and multi-agent workflows function?",
  "Compare Gemini 2.5 Flash vs Claude 3.5 Sonnet",
  "Write a Python automation script for file sorting"
];

export const PublicVisitorView: React.FC<PublicVisitorViewProps> = ({ onBackToDashboard }) => {
  const [input, setInput] = useState('');
  const [displayUrl, setDisplayUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState<Array<{ id: string; role: 'user' | 'model'; text: string; sources?: any[] }>>([
    {
      id: 'welcome',
      role: 'model',
      text: "👋 **Welcome to Luna AI Public Web Assistant**\n\nI am **Luna AI**, your intelligent day-to-day assistant powered by Gemini 2.5 Flash and real-time Google search grounding. Ask me anything about technology, AI models, daily planning, shell scripts, or recent events!"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentHref = window.location.href;
      const baseUrl = currentHref.split('#')[0];
      setDisplayUrl(`${baseUrl}#public`);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const copyUrl = () => {
    if (displayUrl) {
      navigator.clipboard?.writeText(displayUrl).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || loading) return;

    setInput('');

    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', text: query }]);

    const botMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: botMsgId, role: 'model', text: '' }]);
    setLoading(true);

    try {
      const stream = sendMessageStream(query, PERSONAS[0].prompt, []);
      for await (const chunk of stream) {
        setMessages(prev => prev.map(m => {
          if (m.id === botMsgId) {
            return {
              ...m,
              text: m.text + chunk.text,
              sources: chunk.groundingChunks || m.sources
            };
          }
          return m;
        }));
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => prev.map(m => 
        m.id === botMsgId ? { ...m, text: "⚠️ Network request failed. Please try again." } : m
      ));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-950 text-gray-100 font-sans overflow-hidden">
      {/* Navigation / Web Address Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 rounded-lg transition-colors border border-gray-700"
            title="Return to Admin Studio"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Admin Console</span>
          </button>
        </div>

        {/* Real Address Bar Display */}
        <div className="flex-1 max-w-xl bg-gray-950 border border-purple-500/30 rounded-lg px-3 py-1.5 flex items-center justify-between gap-2 text-xs font-mono text-purple-300 shadow-inner min-w-0">
          <div className="flex items-center gap-2 truncate min-w-0">
            <Moon size={14} className="text-purple-400 flex-shrink-0 fill-current" />
            <span className="truncate font-semibold">{displayUrl || 'Loading address...'}</span>
          </div>
          <button
            onClick={copyUrl}
            className="text-gray-400 hover:text-white p-1 rounded flex-shrink-0"
            title="Copy Active URL"
          >
            {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-xs font-mono text-green-400 hidden sm:inline">Luna AI Web Live</span>
        </div>
      </header>

      {/* Public Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-3xl mx-auto w-full">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'model' ? 'items-start' : 'items-start flex-row-reverse'}`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs flex-shrink-0 ${
              msg.role === 'model' ? 'bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white shadow-md' : 'bg-gray-800 text-gray-300'
            }`}>
              {msg.role === 'model' ? <Moon size={16} className="fill-current" /> : <User size={16} />}
            </div>

            <div className={`p-4 rounded-2xl max-w-[85%] ${
              msg.role === 'model' ? 'bg-gray-900 border border-gray-800 text-gray-200' : 'bg-purple-600 text-white'
            }`}>
              {msg.text ? (
                <MarkdownRenderer content={msg.text} />
              ) : (
                <div className="flex items-center gap-2 text-xs text-gray-400 py-1 font-mono">
                  <RefreshCw size={12} className="animate-spin text-purple-400" />
                  <span>Luna AI is searching & generating answer...</span>
                </div>
              )}
              
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-gray-800 text-xs">
                  <span className="text-[10px] text-gray-500 font-semibold uppercase">Sources:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {msg.sources.map((s, i) => (
                      <a key={i} href={s.web?.uri} target="_blank" rel="noreferrer" className="text-purple-400 hover:underline text-[11px] truncate max-w-[150px]">
                        {s.web?.title || 'Web Citation'}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-4 bg-gray-900 border-t border-gray-800">
        <div className="max-w-3xl mx-auto space-y-3">
          
          <div className="hidden sm:flex flex-wrap gap-2">
            {PUBLIC_SAMPLE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-3 py-1 rounded-full border border-gray-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles size={11} className="text-purple-400" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Luna AI anything..."
              className="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-100 outline-none focus:border-purple-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-40 flex items-center gap-1.5 shadow-md shadow-purple-600/20"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};