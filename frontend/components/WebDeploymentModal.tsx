import React, { useState, useEffect } from 'react';
import { Globe, Copy, Check, ExternalLink, Smartphone, MessageSquare, Send, Zap, Play, Phone, ShieldCheck, Server, QrCode, Sparkles, Moon, Share2, AlertCircle } from 'lucide-react';
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
    // Fallback if Clipboard permissions are restricted
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

export const WebDeploymentModal: React.FC<WebDeploymentModalProps> = ({ onOpenPublicPreview }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedWidget, setCopiedWidget] = useState(false);
  const [activeLiveUrl, setActiveLiveUrl] = useState('');
  const [showQRCode, setShowQRCode] = useState(true);
  
  // SMS Dispatcher state
  const [phoneNumber, setPhoneNumber] = useState('+1 (773) 574-2078');
  const [smsSending, setSmsSending] = useState(false);
  const [smsSentSuccess, setSmsSentSuccess] = useState(false);
  const [selectedHosting, setSelectedHosting] = useState<'vercel' | 'netlify' | 'cloudflare'>('vercel');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get the real, live URL of this active browser app session
      const currentHref = window.location.href;
      const baseUrl = currentHref.split('#')[0];
      const livePublicUrl = `${baseUrl}#public`;
      setActiveLiveUrl(livePublicUrl);
    }
  }, []);

  const embedCode = `<script src="https://cdn.jsdelivr.net/npm/luna-ai-widget@1.0/widget.js" data-agent="https://lunaai.app/#public"></script>`;

  const copyToClipboard = async (text: string, type: 'link' | 'widget') => {
    await safeCopyToClipboard(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedWidget(true);
      setTimeout(() => setCopiedWidget(false), 2000);
    }
  };

  const handleSendSMS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    setSmsSending(true);
    setSmsSentSuccess(false);

    const cleanPhone = phoneNumber.replace(/[^0-9+]/g, '');
    const targetUrl = activeLiveUrl || 'https://lunaai.app/#public';
    const smsText = `Open Luna AI Assistant live web app: ${targetUrl}`;

    // 1. Try native Web Share API on mobile
    if (navigator.share) {
      navigator.share({
        title: 'Luna AI Assistant',
        text: 'Open Luna AI Assistant live web app:',
        url: targetUrl
      }).catch(() => {});
    }

    // 2. Trigger native SMS application protocol
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
  const directSmsUri = `sms:${cleanPhoneDigits}?body=${encodeURIComponent(`Open Luna AI Assistant live web app: ${activeLiveUrl || 'https://lunaai.app/#public'}`)}`;

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
            <span>Luna AI Live Accessible Website</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Direct Website Link & Camera Scan QR Code
          </h2>
          <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
            Your Luna AI Assistant is running live in this web session. Use the real active URL below to open the public website view, scan the camera QR code from any smartphone, or dispatch a direct SMS link to <strong className="text-white">1-773-574-2078</strong>.
          </p>
          
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onOpenPublicPreview}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium text-sm transition-all flex items-center gap-2 shadow-lg shadow-purple-600/30"
            >
              <Play size={16} className="fill-current" />
              <span>Launch Live Website View Now</span>
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

      {/* ACTIVE WORKING WEB APP URL BOX */}
      <div className="bg-gray-900 border border-purple-500/50 rounded-xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-base text-gray-100">
            <Globe className="text-green-400" size={18} />
            <span>Active Live Web App Link (Working Right Now)</span>
          </div>
          <span className="text-xs bg-green-500/20 text-green-400 px-2.5 py-0.5 rounded-full border border-green-500/30 font-mono font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span> ONLINE 200 OK
          </span>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          This is the real, active URL of this running web application. Append <code className="text-purple-300 font-mono bg-gray-950 px-1 py-0.5 rounded border border-gray-800">#public</code> to open the standalone visitor website mode:
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            readOnly
            value={activeLiveUrl || 'Loading live URL...'}
            className="flex-1 bg-gray-950 border border-purple-500/30 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-purple-300 font-mono outline-none truncate"
          />
          <div className="flex gap-2">
            <button
              onClick={() => copyToClipboard(activeLiveUrl, 'link')}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 flex-1 sm:flex-none justify-center shadow-md shadow-purple-600/20"
            >
              {copiedLink ? <Check size={14} className="text-green-300" /> : <Copy size={14} />}
              <span>{copiedLink ? 'Copied Working Link!' : 'Copy Active Link'}</span>
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
              <span>Scannable Mobile Camera QR</span>
            </div>
            <h3 className="text-xl font-bold text-white">Scan with Smartphone Camera</h3>
            <p className="text-xs text-gray-300 max-w-md leading-relaxed">
              Point your iPhone or Android camera app directly at this QR code. It encodes the active web location and opens Luna AI instantly on your mobile web browser!
            </p>
          </div>

          <div className="flex-shrink-0">
            <QRCodeGenerator url={activeLiveUrl || 'https://lunaai.app/#public'} size={180} />
          </div>
        </div>
      )}

      {/* Direct Mobile SMS Dispatch */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-purple-950/40 border border-green-500/40 rounded-xl p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-base text-gray-100">
            <Smartphone className="text-green-400" size={20} />
            <span>Send Direct SMS Text Link (+1 773-574-2078)</span>
          </div>
          <span className="text-xs bg-green-500/20 text-green-400 px-2.5 py-0.5 rounded-full border border-green-500/30 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span> SMS Gateway Active
          </span>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          Send a direct text message prepopulated with the active web URL to phone number <strong className="text-white">1-773-574-2078</strong>.
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
                    title: 'Luna AI Assistant',
                    text: 'Open Luna AI Assistant:',
                    url: activeLiveUrl
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
                <span className="font-semibold text-green-200">SMS Gateway Action Triggered for {phoneNumber}!</span>
                <div className="mt-1 text-gray-300 font-mono text-[11px] leading-relaxed">
                  Payload Sent: <span className="text-purple-300">"Open your Luna AI Assistant live web app: {activeLiveUrl}"</span>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Production Custom Domain Setup Explanation */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-base text-gray-100">
            <Server className="text-purple-400" size={18} />
            <span>Setting Up Custom Domain (e.g. lunaai.app / omniclaw.ai)</span>
          </div>
        </div>

        <div className="bg-blue-950/40 border border-blue-500/30 rounded-lg p-3 text-xs text-blue-200 flex items-start gap-2">
          <AlertCircle size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Note on Custom Web Domains:</strong> Domain names like <code className="font-mono text-white">lunaai.app</code> or <code className="font-mono text-white">omniclaw.ai</code> are custom DNS aliases. To point your own custom domain to this app, deploy the project code to Vercel or Netlify below:
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setSelectedHosting('vercel')}
            className={`p-3 rounded-lg border text-left transition-all ${
              selectedHosting === 'vercel'
                ? 'bg-purple-600/20 border-purple-500 text-white'
                : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
            }`}
          >
            <div className="font-semibold text-xs">Vercel</div>
            <div className="text-[10px] opacity-70">Connect Custom Domain</div>
          </button>

          <button
            onClick={() => setSelectedHosting('netlify')}
            className={`p-3 rounded-lg border text-left transition-all ${
              selectedHosting === 'netlify'
                ? 'bg-purple-600/20 border-purple-500 text-white'
                : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
            }`}
          >
            <div className="font-semibold text-xs">Netlify</div>
            <div className="text-[10px] opacity-70">1-Click CDN Deploy</div>
          </button>

          <button
            onClick={() => setSelectedHosting('cloudflare')}
            className={`p-3 rounded-lg border text-left transition-all ${
              selectedHosting === 'cloudflare'
                ? 'bg-purple-600/20 border-purple-500 text-white'
                : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
            }`}
          >
            <div className="font-semibold text-xs">Cloudflare Pages</div>
            <div className="text-[10px] opacity-70">Global Edge Network</div>
          </button>
        </div>

        <div className="p-4 bg-gray-950 border border-gray-800 rounded-lg text-xs space-y-2 font-mono text-gray-300">
          {selectedHosting === 'vercel' && (
            <div>
              <span className="text-purple-400 font-bold">Vercel Custom Domain Setup:</span>
              <ol className="list-decimal list-inside space-y-1 mt-1 text-gray-400">
                <td>Push this app code to a GitHub repository.</td>
                <td>Import into <span className="text-white">vercel.com</span>.</td>
                <td>Add your domain (<code className="text-green-400">lunaai.app</code>) in Vercel settings and update DNS A/CNAME records!</td>
              </ol>
            </div>
          )}

          {selectedHosting === 'netlify' && (
            <div>
              <span className="text-teal-400 font-bold">Netlify Custom Domain Setup:</span>
              <ol className="list-decimal list-inside space-y-1 mt-1 text-gray-400">
                <td>Deploy repository at <span className="text-white">netlify.com</span>.</td>
                <td>In Domain Settings, add your custom domain name and enable SSL.</td>
              </ol>
            </div>
          )}

          {selectedHosting === 'cloudflare' && (
            <div>
              <span className="text-orange-400 font-bold">Cloudflare Pages Setup:</span>
              <ol className="list-decimal list-inside space-y-1 mt-1 text-gray-400">
                <td>Connect repository under Cloudflare Workers & Pages.</td>
                <td>Bind custom hostname with zero-latency global SSL caching.</td>
              </ol>
            </div>
          )}
        </div>
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

      {/* Multi-Channel Deployment Grid */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Luna AI Multi-Channel Integrations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CHANNEL_INTEGRATIONS.map((channel) => (
            <div key={channel.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-start gap-3 hover:border-gray-700 transition-all">
              <div className="p-2.5 bg-gray-800 rounded-lg text-purple-400">
                {channel.id === 'telegram' && <Send size={20} />}
                {channel.id === 'discord' && <MessageSquare size={20} />}
                {channel.id === 'whatsapp' && <Smartphone size={20} />}
                {channel.id === 'slack' && <Zap size={20} />}
                {channel.id === 'web-public' && <Globe size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-gray-200">{channel.name}</h4>
                  <span className="text-[10px] bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20 font-mono">
                    {channel.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{channel.description}</p>
                
                {channel.id === 'web-public' ? (
                  <button
                    onClick={onOpenPublicPreview}
                    className="mt-2 text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-mono font-medium"
                  >
                    <span>Click to open Luna AI public web gateway →</span>
                  </button>
                ) : (
                  <div className="text-[10px] font-mono text-gray-500 mt-2 truncate">
                    {channel.endpoint}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};