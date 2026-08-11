import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Globe, ArrowLeft, Send, Sparkles, RefreshCw, Copy, Check, Moon, Lock, Scissors, Clipboard } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { sendMessageStream } from '../services/geminiService';
import { PERSONAS } from '../constants';
import { AdminPasswordModal } from './AdminPasswordModal';

interface PublicVisitorViewProps {
  onBackToDashboard: () => void;
}

const PUBLIC_SAMPLE_PROMPTS = [
  "What is Luna AI and how can it assist me daily?",
  "How do persistent memory and multi-agent workflows function?",
  "Compare Gemini 2.5 Flash vs Claude 3.5 Sonnet",
  "Write a Python automation script for file sorting"
];

const safeCopyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback if Clipboard API permissions are restricted
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.warn('Clipboard copy fallback failed:', err);
    return false;
  }
};

export const PublicVisitorView: React.FC<PublicVisitorViewProps> = ({ onBackToDashboard }) => {
  const [input, setInput] = useState('');
  const [displayUrl, setDisplayUrl] = useState('https://lunaai09.netlify.app/#public');
  const [copied, setCopied] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [actionMessageId, setActionMessageId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<string | null>(null);

  const [messages, setMessages] = useState<Array<{ id: string; role: 'user' | 'model'; text: string; sources?: any[] }>>([
    {
      id: 'welcome',
      role: 'model',
      text: "👋 **Welcome to Luna AI Public Web Assistant**\n\nI am **Luna AI**, hosted live at **https://lunaai09.netlify.app/**."
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const href = window.location.href;
      if (!href.startsWith('blob:') && !href.includes('usercontent.goog')) {
        const clean = href.split('#')[0];
        setDisplayUrl(`${clean}#public`);
      } else {
        setDisplayUrl('https://lunaai09.netlify.app/#public');
      }
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

  const handleAdminConsoleClick = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordSuccess = () => {
    setShowPasswordModal(false);
    onBackToDashboard();
  };

  const handleMessageAction = async (msgId: string, text: string, type: 'cut' | 'copy' | 'paste') => {
    if (type === 'copy' || type === 'cut') {
      if (text) {
        await safeCopyToClipboard(text);
        setActionMessageId(msgId);
        setActionType(type);
        setTimeout(() => {
          setActionMessageId(null);
          setActionType(null);
        }, 2000);
      }
    } else if (type === 'paste') {
      try {
        if (navigator.clipboard && typeof navigator.clipboard.readText === 'function') {
          const pasted = await navigator.clipboard.readText();
          if (pasted) {
            setInput(prev => prev + (prev ? ' ' : '') + pasted);
          }
        }
      } catch {
        // Ignore clipboard read error
      }
      setActionMessageId(msgId);
      setActionType('paste');
      setTimeout(() => {
        setActionMessageId(null);
        setActionType(null);
      }, 2000);
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
        m.id === botMsgId ? { ...m, text: "I experienced a brief pause. Please try asking your question again!" } : m
      ));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-950 text-gray-100 font-sans overflow-hidden">
      {/* Password Modal */}
      <AdminPasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handlePasswordSuccess}
      />

      {/* Navigation / Web Address Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handleAdminConsoleClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 rounded-lg text-xs font-semibold transition-all shadow-sm"
            title="Access Password Protected Admin Studio"
          >
            <Lock size={13} className="text-purple-400" />
            <span className="hidden sm:inline">Admin Console</span>
          </button>
        </div>

        {/* Clean Address Bar Display */}
        <div className="flex-1 max-w-xl bg-gray-950 border border-purple-500/30 rounded-lg px-3 py-1.5 flex items-center justify-between gap-2 text-xs font-mono text-purple-300 shadow-inner min-w-0">
          <div className="flex items-center gap-2 truncate min-w-0">
            <Moon size={14} className="text-purple-400 flex-shrink-0 fill-current" />
            <span className="truncate font-semibold">{displayUrl}</span>
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
          <span className="text-xs font-mono text-green-400 hidden sm:inline">Netlify Live</span>
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

              {/* Toolbar Cut/Copy/Paste */}
              {msg.role === 'model' && msg.text && (
                <div className="mt-3 pt-2 border-t border-gray-800/60 flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider font-mono">
                    Actions:
                  </span>

                  <button
                    onClick={() => handleMessageAction(msg.id, msg.text, 'copy')}
                    className="flex items-center gap-1 px-2 py-0.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded text-[11px] font-medium border border-gray-700 transition-all"
                  >
                    {actionMessageId === msg.id && actionType === 'copy' ? (
                      <>
                        <Check size={11} className="text-green-400" />
                        <span className="text-green-400 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} className="text-purple-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleMessageAction(msg.id, msg.text, 'cut')}
                    className="flex items-center gap-1 px-2 py-0.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded text-[11px] font-medium border border-gray-700 transition-all"
                  >
                    {actionMessageId === msg.id && actionType === 'cut' ? (
                      <>
                        <Check size={11} className="text-green-400" />
                        <span className="text-green-400 font-bold">Cut</span>
                      </>
                    ) : (
                      <>
                        <Scissors size={11} className="text-amber-400" />
                        <span>Cut</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleMessageAction(msg.id, msg.text, 'paste')}
                    className="flex items-center gap-1 px-2 py-0.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded text-[11px] font-medium border border-gray-700 transition-all"
                  >
                    {actionMessageId === msg.id && actionType === 'paste' ? (
                      <>
                        <Check size={11} className="text-green-400" />
                        <span className="text-green-400 font-bold">Pasted to Input</span>
                      </>
                    ) : (
                      <>
                        <Clipboard size={11} className="text-blue-400" />
                        <span>Paste</span>
                      </>
                    )}
                  </button>
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
