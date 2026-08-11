import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { WebDeploymentModal } from './components/WebDeploymentModal';
import { MemoryManager } from './components/MemoryManager';
import { ModelMatrixView } from './components/ModelMatrixView';
import { PublicVisitorView } from './components/PublicVisitorView';

import { Message, Persona, ActiveTab, MemoryItem } from './types';
import { PERSONAS, INITIAL_MEMORIES } from './constants';
import { sendMessageStream, resetConversation, fileToBase64 } from './services/geminiService';
import { Menu, X, Share2, Sparkles, Globe } from 'lucide-react';

export default function App() {
  const [currentPersona, setCurrentPersona] = useState<Persona>(PERSONAS[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [memories, setMemories] = useState<MemoryItem[]>(INITIAL_MEMORIES);
  const [isPublicMode, setIsPublicMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync state with URL Hash string for global accessible links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'public' || hash === 'website') {
        setIsPublicMode(true);
      } else {
        setIsPublicMode(false);
        if (['chat', 'memory', 'models', 'deploy'].includes(hash)) {
          setActiveTab(hash as ActiveTab);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const navigateToTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsPublicMode(false);
    window.location.hash = tab;
  };

  const navigateToPublic = () => {
    setIsPublicMode(true);
    window.location.hash = 'public';
  };

  const handleSelectPersona = useCallback((persona: Persona) => {
    setCurrentPersona(persona);
    setMessages([]);
    resetConversation();
    setMobileMenuOpen(false);
    navigateToTab('chat');
  }, []);

  const handleAddMemory = (memory: Omit<MemoryItem, 'id' | 'createdAt'>) => {
    const newMem: MemoryItem = {
      ...memory,
      id: `mem-${Date.now()}`,
      createdAt: new Date().toLocaleDateString()
    };
    setMemories(prev => [newMem, ...prev]);
  };

  const handleDeleteMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  const handleSendMessage = async (text: string, file?: File) => {
    if (!text.trim() && !file) return;

    const userMsgId = Date.now().toString();
    let attachmentData: { mimeType: string; data: string; url: string } | undefined;

    if (file) {
      try {
        const base64Data = await fileToBase64(file);
        const url = URL.createObjectURL(file);
        attachmentData = {
          mimeType: file.type,
          data: base64Data,
          url: url
        };
      } catch (error) {
        console.error("Error reading file:", error);
        alert("Failed to process the image.");
        return;
      }
    }

    const newUserMessage: Message = {
      id: userMsgId,
      role: 'user',
      text: text,
      attachment: attachmentData ? { mimeType: attachmentData.mimeType, url: attachmentData.url } : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsTyping(true);

    const assistantMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { 
      id: assistantMsgId, 
      role: 'model', 
      text: '', 
      isStreaming: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    try {
      const stream = sendMessageStream(
        text, 
        currentPersona.prompt, 
        memories,
        attachmentData ? { mimeType: attachmentData.mimeType, data: attachmentData.data } : undefined
      );

      for await (const chunk of stream) {
        setMessages(prev => prev.map(msg => {
          if (msg.id === assistantMsgId) {
            return {
              ...msg,
              text: msg.text + chunk.text,
              sources: chunk.groundingChunks || msg.sources
            };
          }
          return msg;
        }));
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMsgId 
          ? { ...msg, text: "⚠️ An error occurred while communicating with the agent. Please check your network connection." } 
          : msg
      ));
    } finally {
      setIsTyping(false);
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMsgId ? { ...msg, isStreaming: false } : msg
      ));
    }
  };

  if (isPublicMode) {
    return <PublicVisitorView onBackToDashboard={() => navigateToTab('chat')} />;
  }

  return (
    <div className="flex h-full w-full bg-gray-950 text-gray-100 font-sans overflow-hidden">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar 
          currentPersona={currentPersona} 
          onSelectPersona={handleSelectPersona} 
          activeTab={activeTab}
          setActiveTab={(tab) => {
            navigateToTab(tab);
            setMobileMenuOpen(false);
          }}
          memoryCount={memories.length}
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        
        {/* Mobile Top Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900">
          <div className="flex items-center gap-2 font-bold text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            OmniClaw Platform
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-400 hover:text-white">
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Desktop Top Header Bar */}
        <div className="hidden md:flex items-center justify-between px-6 py-3.5 border-b border-gray-800 bg-gray-900/60 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h2 className="text-base font-semibold text-gray-100 flex items-center gap-2">
              {activeTab === 'chat' && currentPersona.name}
              {activeTab === 'deploy' && 'Global Web Access & Deployment'}
              {activeTab === 'memory' && 'Persistent Memory Store'}
              {activeTab === 'models' && 'Supported AI Models Matrix'}
              
              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] uppercase font-mono tracking-wider border border-blue-500/20">
                ACTIVE
              </span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {activeTab === 'chat' && currentPersona.description}
              {activeTab === 'deploy' && 'Publish to world accessible web URL, iframe widgets, or messaging apps'}
              {activeTab === 'memory' && 'Facts & context retained across all user conversations'}
              {activeTab === 'models' && 'OmniClaw multi-provider model selection architecture'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateToTab('deploy')}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-xs font-medium border border-gray-700 flex items-center gap-1.5 transition-colors"
            >
              <Share2 size={14} className="text-green-400" />
              <span>Web Share Link</span>
            </button>

            <button
              onClick={navigateToPublic}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-md shadow-blue-600/20"
            >
              <Globe size={14} />
              <span>Live Website View</span>
            </button>
          </div>
        </div>

        {/* Main Tab View Switcher */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto scroll-smooth">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-blue-500/20 border border-blue-400/30">
                      <Sparkles size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-100 mb-2">
                      {currentPersona.name} Initialized
                    </h3>
                    <p className="text-sm text-gray-400 max-w-md leading-relaxed mb-6">
                      Ready to assist with real-time web search, persistent memory, and problem solving. Ask any question to get started.
                    </p>
                  </div>
                ) : (
                  <div className="max-w-4xl mx-auto w-full pb-4">
                    {messages.map(msg => (
                      <ChatMessage key={msg.id} message={msg} />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <ChatInput onSend={handleSendMessage} disabled={isTyping} />
            </div>
          )}

          {activeTab === 'deploy' && (
            <WebDeploymentModal 
              onOpenPublicPreview={navigateToPublic} 
            />
          )}

          {activeTab === 'memory' && (
            <MemoryManager 
              memories={memories} 
              onAddMemory={handleAddMemory} 
              onDeleteMemory={handleDeleteMemory} 
            />
          )}

          {activeTab === 'models' && (
            <ModelMatrixView />
          )}
        </div>

      </div>
    </div>
  );
}
