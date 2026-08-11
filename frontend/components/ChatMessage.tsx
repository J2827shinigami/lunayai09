import React from 'react';
import { Bot, User, Globe, ExternalLink, Moon } from 'lucide-react';
import { Message } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';

  return (
    <div className={`flex gap-4 p-4 sm:p-6 transition-colors ${isModel ? 'bg-gray-900/40 border-y border-gray-800/40' : ''}`}>
      <div className="flex-shrink-0 mt-1">
        {isModel ? (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 border border-purple-400/30 flex items-center justify-center text-white shadow-lg shadow-purple-500/10">
            <Moon size={18} className="fill-current" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-300">
            <User size={18} />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-xs text-gray-400">
            {isModel ? 'Luna AI' : 'You'}
          </span>
          <span className="text-[10px] text-gray-600">
            {message.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        {message.attachment && (
          <div className="mb-3">
            <img 
              src={message.attachment.url} 
              alt="Uploaded attachment" 
              className="max-w-xs max-h-60 object-cover rounded-xl border border-gray-700 shadow-md"
            />
          </div>
        )}

        <div className="prose prose-invert max-w-none">
          {message.text ? (
            <MarkdownRenderer content={message.text} />
          ) : message.isStreaming ? (
            <div className="flex items-center gap-1.5 py-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '300ms' }}></div>
              <span className="text-xs text-gray-500 ml-2 font-mono">Luna AI is thinking & searching...</span>
            </div>
          ) : null}
        </div>

        {/* Live Search Sources */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-800/80">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
              <Globe size={13} className="text-purple-400" />
              <span>Verified Search Citations ({message.sources.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {message.sources.map((source, idx) => {
                if (!source.web?.uri) return null;
                const hostname = new URL(source.web.uri).hostname.replace('www.', '');
                return (
                  <a 
                    key={idx}
                    href={source.web.uri} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-950/80 border border-gray-800 hover:border-gray-700 hover:bg-gray-800/50 transition-all group"
                  >
                    <div className="truncate pr-2">
                      <div className="text-xs text-purple-300 font-medium truncate group-hover:text-purple-200">
                        {source.web.title || hostname}
                      </div>
                      <div className="text-[10px] text-gray-500 truncate">{hostname}</div>
                    </div>
                    <ExternalLink size={12} className="text-gray-500 group-hover:text-purple-400 flex-shrink-0" />
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};