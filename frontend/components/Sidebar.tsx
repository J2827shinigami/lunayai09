import React from 'react';
import { Globe, Terminal, BookOpen, Cpu, Database, Layers, Radio, Share2, Sparkles, MessageSquare, Moon } from 'lucide-react';
import { Persona, ActiveTab } from '../types';
import { PERSONAS } from '../constants';

interface SidebarProps {
  currentPersona: Persona;
  onSelectPersona: (persona: Persona) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  memoryCount: number;
}

const iconMap: Record<string, React.ReactNode> = {
  Moon: <Moon size={18} />,
  Globe: <Globe size={18} />,
  Terminal: <Terminal size={18} />,
  BookOpen: <BookOpen size={18} />,
  Cpu: <Cpu size={18} />,
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentPersona, 
  onSelectPersona, 
  activeTab, 
  setActiveTab,
  memoryCount
}) => {
  return (
    <div className="w-72 bg-gray-900 border-r border-gray-800 flex flex-col h-full flex-shrink-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-md shadow-purple-500/20 border border-purple-400/30">
            <Moon size={20} className="text-white fill-current" />
          </div>
          <div>
            <div className="font-bold text-gray-100 text-base tracking-tight flex items-center gap-1.5">
              Luna AI
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded border border-purple-500/30">v2.5</span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono">GLOBAL AGENT PLATFORM</p>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="p-3 border-b border-gray-800 space-y-1">
        <button
          onClick={() => setActiveTab('chat')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'chat'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
              : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
          }`}
        >
          <MessageSquare size={16} />
          <span>Luna AI Workspace</span>
        </button>

        <button
          onClick={() => setActiveTab('deploy')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'deploy'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
              : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <Share2 size={16} className="text-green-400" />
            <span>Web Deployment Link</span>
          </div>
          <span className="text-[9px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-mono">LIVE</span>
        </button>

        <button
          onClick={() => setActiveTab('memory')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'memory'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
              : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <Database size={16} />
            <span>Persistent Memory</span>
          </div>
          <span className="text-[10px] bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full font-mono">
            {memoryCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('models')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'models'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
              : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
          }`}
        >
          <Layers size={16} />
          <span>AI Model Matrix</span>
        </button>
      </div>

      {/* Persona Selection */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        <div>
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2.5 px-2 flex items-center justify-between">
            <span>Luna AI Specialized Agents</span>
            <Sparkles size={12} className="text-purple-400" />
          </div>
          <div className="space-y-1.5">
            {PERSONAS.map((persona) => {
              const isSelected = currentPersona.id === persona.id && activeTab === 'chat';
              return (
                <button
                  key={persona.id}
                  onClick={() => {
                    onSelectPersona(persona);
                    setActiveTab('chat');
                  }}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl transition-all text-left ${
                    isSelected
                      ? 'bg-purple-600/15 border border-purple-500/40 text-purple-300 shadow-sm'
                      : 'hover:bg-gray-800/80 text-gray-400 hover:text-gray-200 border border-transparent'
                  }`}
                >
                  <div className={`mt-0.5 p-1.5 rounded-lg ${isSelected ? 'bg-purple-500/20 text-purple-300' : 'bg-gray-800 text-gray-400'}`}>
                    {iconMap[persona.icon]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-xs text-gray-200 truncate">{persona.name}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5 line-clamp-2 leading-tight">
                      {persona.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Global Node Gateway Status */}
        <div className="pt-2">
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
            Gateway Engine
          </div>
          <div className="bg-gray-950/80 rounded-xl border border-gray-800 p-3 space-y-2.5 font-mono text-[11px]">
            <div className="flex items-center justify-between text-gray-300">
              <span className="flex items-center gap-1.5">
                <Radio size={12} className="text-green-400 animate-pulse" />
                <span>Luna AI Web Relay</span>
              </span>
              <span className="text-green-400">ONLINE</span>
            </div>
            <div className="flex items-center justify-between text-gray-400 text-[10px]">
              <span>LLM Engine</span>
              <span className="text-purple-300 truncate max-w-[100px]">Gemini 2.5 Flash</span>
            </div>
            <div className="flex items-center justify-between text-gray-400 text-[10px]">
              <span>Search Tooling</span>
              <span className="text-green-400">Google Grounded</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-3 border-t border-gray-800 text-[11px] text-gray-500 flex justify-between items-center bg-gray-950/40 font-mono">
        <span>Luna AI Core</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
          <span>Global</span>
        </span>
      </div>
    </div>
  );
};