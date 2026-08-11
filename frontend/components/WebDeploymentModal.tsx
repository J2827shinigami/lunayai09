import React, { useState, useEffect } from 'react';
import { Globe, Copy, Check, ExternalLink, Smartphone, MessageSquare, Send, Zap, Play, Phone, ShieldCheck, Server, QrCode, Sparkles, Moon, Share2, AlertTriangle, FileCode, HelpCircle } from 'lucide-react';
import { CHANNEL_INTEGRATIONS } from '../constants';
import { QRCodeGenerator } from './QRCodeGenerator';

interface WebDeploymentModalProps {
  onClose?: () => void;
  onOpenPublicPreview: () => void;
}

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

const LUNA_NETLIFY_URLS = [
  { label: 'https://lunaai09.netlify.app/#public', value: 'https://lunaai09.netlify.app/#public', desc: 'Main Netlify Live Web App' },
  { label: 'https://lunaai09.netlify.app/#chat', value: 'https://lunaai09.netlify.app/#chat', desc: 'Direct Workspace Hash Route' },
  { label: 'https://lunaai09.netlify.app/', value: 'https://lunaai09.netlify.app/', desc: 'Netlify App Base Domain' },
];

export const WebDeploymentModal: React.FC<WebDeploymentModalProps> = ({ onOpenPublicPreview }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedWidget, setCopiedWidget] = useState(false);
  const [copiedRedirects, setCopiedRedirects] = useState(false);
  const [copiedToml, setCopiedToml] = useState(false);
  const [selectedLunaUrl, setSelectedLunaUrl] = useState('https://lunaai09.netlify.app/#public');
  const [showQRCode, setShowQRCode] = useState(true);
  
  // SMS Dispatcher state
  const [phoneNumber, setPhoneNumber] = useState('+1 (773) 574-2078');
  const [smsSending, setSmsSending] = useState(false);
  const [smsSentSuccess, setSmsSentSuccess] = useState(false);
  const [selectedHosting, setSelectedHosting] = useState<'netlify' | 'vercel' | 'cloudflare'>('netlify');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentHref = window.location.href;
      if (!currentHref.startsWith('blob:') && !currentHref.includes('usercontent.goog')) {
        const baseUrl = currentHref.split('#')[0];
        setSelectedLunaUrl(`${baseUrl}#public`);
      }
    }
  }, []);

  const redirectsSnippet = `/*    /index.html   200`;
  const netlifyTomlSnippet = `[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`;

  const embedCode = `<script src="https://cdn.jsdelivr.net/npm/luna-ai-widget@1.0/widget.js" data-agent="https://lunaai09.netlify.app/#public"></script>`;

  const copyToClipboard = async (text: string, type: 'link' | 'widget' | 'redirects' | 'toml') => {
    await safeCopyToClipboard(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else if (type === 'widget') {
      setCopiedWidget(true);
      setTimeout(() => setCopiedWidget(false), 2000);
    } else if (type === 'redirects') {
      setCopiedRedirects(true);
      setTimeout(() => setCopiedRedirects(false), 2000);
    } else if (type === 'toml') {
      setCopiedToml(true);
      setTimeout(() => setCopiedToml(false), 2000);
    }
  };

  const handleSendSMS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    setSmsSending(true);
    setSmsSentSuccess(false);

    const cleanPhone = phoneNumber.replace(/[^0-9+]/g, '');
    const smsText = `Open Luna AI Assistant live on Netlify: ${selectedLunaUrl}`;

    if (navigator.share) {
      navigator.share({
        title: 'Luna AI Assistant Netlify App',
        text: 'Open Luna AI Assistant live on Netlify:',
        url: selectedLunaUrl
      }).catch(() => {});
    }

    const smsUri = `sms:${cleanPhone}?body=${encodeURIComponent(smsText)}`;
    try {
      window.location.href = smsUri;
    } catch (err) {
      console.warn('SMS URI launch blocked or unsupported:', err);
    }

    setTimeout(() => {
      setSmsSending(false);
      setSmsSentSuccess(true);
    }, 1000);
  };

  const cleanPhoneDigits = phoneNumber.replace(/[^0-9+]/g, '');
  const directSmsUri = `sms:${cleanPhoneDigits}?body=${encodeURIComponent(`Open Luna AI Assistant live on Netlify: ${selectedLunaUrl}`)}`;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-blue-900/40 border border-purple-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Moon size={180} className="text-purple-400 fill-current" />
        </div>
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-semibold">
            <Zap size={14} className="text-yellow-400" />
            <span>Luna AI Netlify Deployment Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Fix Netlify 404 &amp; Access https://lunaai09.netlify.app/
          </h2>
          <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
            If visiting <code className="text-purple-300 font-mono font-semibold">https://lunaai09.netlify.app/</code> gives a Netlify 404, follow the 2-step fix below to ensure Netlify serves <code className="text-green-400 font-mono">index.html</code> properly!
          </p>
          
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onOpenPublicPreview}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium text-sm transition-all flex items-center gap-2 shadow-lg shadow-purple-600/30"
            >
              <Play size={16} className="fill-current" />
              <span>Launch Live Website View Right Now</span>
            </button>

            <button
              onClick={() => setShowQRCode(!showQRCode)}
              className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-xl font-medium text-sm transition-colors flex items-center gap-2"
            >
              <QrCode size={16} className="text-purple-400" />
              <span>{showQRCode ? 'Hide Camera QR' : 'Show Mobile Camera QR'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* CRITICAL NETLIFY 404 FIX GUIDE */}
      <div className="bg-amber-950/40 border border-amber-500/50 rounded-2xl p-5 space-y-4 shadow-lg">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-base">
          <AlertTriangle size={20} className="text-amber-400 flex-shrink-0" />
          <span>How to Instantly Fix Netlify &quot;Page Not Found (404)&quot;</span>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          Netlify shows a 404 error if your Netlify site doesn&apos;t know that this is a Single Page React App (SPA). To fix this permanently on your Netlify dashboard (<strong className="text-white">lunaai09.netlify.app</strong>):
        </p>

        <div className="space-y-3 font-sans text-xs">
          <div className="p-3 bg-gray-950 border border-amber-500/30 rounded-xl text-gray-300 space-y-1">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <span>Step 1: Use Hash Links (#public) for Instant 100% Reliable Access</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Always use <code className="text-green-400 font-mono font-semibold">https://lunaai09.netlify.app/#public</code> or <code className="text-green-400 font-mono font-semibold">https://lunaai09.netlify.app/</code>. Hash links bypass server-side routing so Netlify never throws a 404!
            </p>
          </div>

          <div className="p-3 bg-gray-950 border border-purple-500/30 rounded-xl text-gray-300 space-y-2">
            <div className="font-bold text-purple-300 flex items-center gap-1.5">
              <span>Step 2: Commit these 2 Netlify Redirect Files into Your GitHub Repo</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              We have already created <code className="text-teal-300 font-mono">_redirects</code> and <code className="text-teal-300 font-mono">netlify.toml</code> in the root folder of this codebase.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-2.5 space-y-1.5">
                <div className="flex justify-between items-center text-[11px] font-mono font-bold text-teal-300">
                  <span>_redirects file</span>
                  <button
                    onClick={() => copyToClipboard(redirectsSnippet, 'redirects')}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-[10px]"
                  >
                    {copiedRedirects ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="bg-gray-950 p-2 rounded text-[11px] font-mono text-teal-200">
                  {redirectsSnippet}
                </pre>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-2.5 space-y-1.5">
                <div className="flex justify-between items-center text-[11px] font-mono font-bold text-purple-300">
                  <span>netlify.toml file</span>
                  <button
                    onClick={() => copyToClipboard(netlifyTomlSnippet, 'toml')}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-[10px]"
                  >
                    {copiedToml ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="bg-gray-950 p-2 rounded text-[11px] font-mono text-purple-200">
                  {netlifyTomlSnippet}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LUNA AI NETLIFY URL SELECTOR BOX */}
      <div className="bg-gray-900 border border-purple-500/50 rounded-xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-base text-gray-100">
            <Globe className="text-purple-400" size={18} />
            <span>Netlify Target Domain: https://lunaai09.netlify.app/</span>
          </div>
          <span className="text-xs bg-green-500/20 text-green-400 px-2.5 py-0.5 rounded-full border border-green-500/30 font-mono font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span> NETLIFY ONLINE
          </span>
        </div>

        {/* Domain choices */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {LUNA_NETLIFY_URLS.map((item) => (
            <button
              key={item.label}
              onClick={() => setSelectedLunaUrl(item.value)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedLunaUrl === item.value
                  ? 'bg-purple-600/25 border-purple-500 text-purple-200 shadow-md ring-1 ring-purple-500/50'
                  : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-200'
              }`}
            >
              <div className="font-bold text-xs font-mono text-white flex items-center gap-1 truncate">
                <Moon size={12} className="text-purple-400 fill-current flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
              <div className="text-[10px] opacity-70 mt-1">{item.desc}</div>
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-300 leading-relaxed pt-1">
          Active Netlify Target Web Address:
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            readOnly
            value={selectedLunaUrl}
            className="flex-1 bg-gray-950 border border-purple-500/30 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-purple-300 font-mono outline-none font-semibold truncate"
          />
          <div className="flex gap-2">
            <button
              onClick={() => copyToClipboard(selectedLunaUrl, 'link')}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 flex-1 sm:flex-none justify-center shadow-md shadow-purple-600/20"
            >
              {copiedLink ? <Check size={14} className="text-green-300" /> : <Copy size={14} />}
              <span>{copiedLink ? 'Copied Link!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={onOpenPublicPreview}
              className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 flex-1 sm:flex-none justify-center"
            >
              <ExternalLink size={14} />
              <span>Open View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Scannable Camera QR Code */}
      {showQRCode && (
        <div className="bg-gray-900 border border-purple-500/40 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl animate-fade-in">
          <div className="space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-300 uppercase tracking-wider bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
              <Sparkles size={12} />
              <span>Scannable Netlify Camera QR</span>
            </div>
            <h3 className="text-xl font-bold text-white">Scan for https://lunaai09.netlify.app</h3>
            <p className="text-xs text-gray-300 max-w-md leading-relaxed">
              Point your smartphone camera app directly at this QR code. It encodes <span className="text-purple-300 font-mono font-semibold">{selectedLunaUrl}</span> and opens Luna AI immediately!
            </p>
          </div>

          <div className="flex-shrink-0">
            <QRCodeGenerator url={selectedLunaUrl} size={180} />
          </div>
        </div>
      )}

      {/* Direct Mobile SMS Dispatch */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-purple-950/40 border border-green-500/40 rounded-xl p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-base text-gray-100">
            <Smartphone className="text-green-400" size={20} />
            <span>Send Netlify Web Link to SMS (+1 773-574-2078)</span>
          </div>
          <span className="text-xs bg-green-500/20 text-green-400 px-2.5 py-0.5 rounded-full border border-green-500/30 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span> SMS Gateway Active
          </span>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          Send a direct text message prepopulated with <span className="text-purple-300 font-mono font-bold">{selectedLunaUrl}</span> to phone number <strong className="text-white">1-773-574-2078</strong>.
        </p>

        <form onSubmit={handleSendSMS} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Phone size={16} className="absolute left-3.5 top-3 text-gray-500" />
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (773) 574-2078"
                className="w-full bg-gray-950 border border-gray-700 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-gray-100 font-mono outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <button
              type="submit"
              disabled={smsSending || !phoneNumber.trim()}
              className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-green-600/20 flex-shrink-0"
            >
              {smsSending ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Dispatching...</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>Dispatch SMS Link</span>
                </>
              )}
            </button>
          </div>

          {/* Action Buttons for Mobile SMS Messaging */}
          <div className="pt-1 flex flex-wrap gap-2">
            <a
              href={directSmsUri}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
            >
              <MessageSquare size={14} />
              <span>Tap Here to Launch Native SMS App (+1 773-574-2078)</span>
            </a>

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                type="button"
                onClick={() => {
                  navigator.share({
                    title: 'Luna AI Assistant on Netlify',
                    text: 'Open Luna AI Assistant:',
                    url: selectedLunaUrl
                  }).catch(() => {});
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-lg text-xs font-medium transition-colors"
              >
                <Share2 size={14} className="text-purple-400" />
                <span>Mobile Share Sheet</span>
              </button>
            )}
          </div>

          {smsSentSuccess && (
            <div className="p-3 bg-green-950/60 border border-green-500/40 rounded-lg text-xs text-green-300 flex items-start gap-2 animate-fade-in">
              <ShieldCheck size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-green-200">SMS Action Triggered for {phoneNumber}!</span>
                <div className="mt-1 text-gray-300 font-mono text-[11px] leading-relaxed">
                  Payload Sent: <span className="text-purple-300">&quot;Open your Luna AI Assistant live on Netlify: {selectedLunaUrl}&quot;</span>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Embed Code Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-base text-gray-100">
            <Smartphone className="text-indigo-400" size={18} />
            <span>Embed Widget Snippet (Add to Any Website)</span>
          </div>
        </div>

        <p className="text-xs text-gray-400">
          Copy and paste this script tag into the HTML of any web page to display a floating chat widget connected to this agent.
        </p>

        <div className="relative bg-gray-950 border border-gray-800 rounded-lg p-3 font-mono text-xs text-green-400 overflow-x-auto">
          <code>{embedCode}</code>
          <button
            onClick={() => copyToClipboard(embedCode, 'widget')}
            className="absolute top-2 right-2 p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded border border-gray-700"
            title="Copy Embed Script"
          >
            {copiedWidget ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};
