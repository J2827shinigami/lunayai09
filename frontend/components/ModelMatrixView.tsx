import React, { useState } from 'react';
import { Layers, CheckCircle2, Zap, Shield, Cpu, Bot, MessageSquare, Sparkles, Terminal, Server, Check, ArrowRight } from 'lucide-react';
import { CURRENT_AI_MODELS } from '../constants';
import { AIModelInfo } from '../types';

interface ModelMatrixViewProps {
  activeModelId?: string;
  onSelectModel?: (model: AIModelInfo) => void;
}

export const ModelMatrixView: React.FC<ModelMatrixViewProps> = ({
  activeModelId = 'gemini-2.5-flash',
  onSelectModel
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedModel, setSelectedModel] = useState<string>(activeModelId);

  const filterOptions = [
    { label: 'All AI Engines', value: 'all' },
    { label: 'OpenClaw Agent', value: 'OpenClaw Agent Engine' },
    { label: 'ChatGPT (OpenAI)', value: 'OpenAI (ChatGPT)' },
    { label: 'Claude (Anthropic)', value: 'Anthropic (Claude)' },
    { label: 'Google Gemini', value: 'Google' },
    { label: 'DeepSeek / Local', value: 'DeepSeek' }
  ];

  const filteredModels = CURRENT_AI_MODELS.filter((model) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'DeepSeek') return model.provider === 'DeepSeek' || model.provider === 'Meta / Ollama';
    return model.provider === selectedFilter;
  });

  const handleChooseModel = (model: AIModelInfo) => {
    setSelectedModel(model.id);
    if (onSelectModel) {
      onSelectModel(model);
    }
  };

  const getProviderBadgeColor = (provider: AIModelInfo['provider']) => {
    switch (provider) {
      case 'OpenClaw Agent Engine':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'OpenAI (ChatGPT)':
        return 'bg-green-500/20 text-green-300 border-green-500/40';
      case 'Anthropic (Claude)':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Google':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'DeepSeek':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Matrix Header */}
      <div className="bg-gray-900 border border-purple-500/30 rounded-2xl p-6 space-y-3 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-xl text-gray-100">
            <div className="p-2 bg-purple-600/20 text-purple-400 rounded-xl border border-purple-500/30">
              <Layers size={22} />
            </div>
            <span>Luna AI Multi-Model Intelligence Architecture</span>
          </div>
          <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full font-mono font-semibold">
            {CURRENT_AI_MODELS.length} Engines Connected
          </span>
        </div>

        <p className="text-sm text-gray-300 leading-relaxed max-w-3xl">
          Luna AI supports unified model routing across <strong className="text-purple-300">OpenClaw Agent Core</strong>, <strong className="text-green-300">ChatGPT (OpenAI GPT-4o & o3-mini)</strong>, <strong className="text-amber-300">Anthropic Claude (Claude 3.5 & 3.7 Sonnet)</strong>, <strong className="text-cyan-300">DeepSeek R1</strong>, and <strong className="text-blue-300">Google Gemini 2.5 Flash</strong>. Switch backends instantly depending on speed, deep reasoning, coding, or privacy needs.
        </p>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-800">
          {filterOptions.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedFilter(filter.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedFilter === filter.value
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20 font-semibold'
                  : 'bg-gray-950 text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-gray-800'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredModels.map((model) => {
          const isSelected = selectedModel === model.id;
          return (
            <div 
              key={model.id} 
              className={`bg-gray-900 border rounded-2xl p-5 space-y-4 relative overflow-hidden transition-all flex flex-col justify-between ${
                isSelected 
                  ? 'border-purple-500 ring-1 ring-purple-500/50 shadow-xl shadow-purple-500/10' 
                  : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-bl-xl tracking-wider flex items-center gap-1">
                  <Check size={12} />
                  <span>Selected Engine</span>
                </div>
              )}

              <div className="space-y-3">
                {/* Title & Badge */}
                <div className="flex items-start justify-between pr-12">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-gray-800 rounded-xl text-purple-400">
                      {model.id.includes('claw') ? <Bot size={20} /> :
                       model.id.includes('chatgpt') ? <MessageSquare size={20} /> :
                       model.id.includes('claude') ? <Layers size={20} /> :
                       model.id.includes('deepseek') ? <Terminal size={20} /> :
                       model.id.includes('llama') ? <Server size={20} /> : <Sparkles size={20} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-gray-100">{model.name}</h3>
                      <span className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded border mt-1 ${getProviderBadgeColor(model.provider)}`}>
                        {model.provider}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">{model.description}</p>

                {/* Spec Table */}
                <div className="pt-2 border-t border-gray-800/80 space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Context Window:</span>
                    <span className="text-purple-300 font-semibold">{model.contextWindow}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Speed / Latency:</span>
                    <span className="text-gray-200">{model.latencyRating}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Search Grounding:</span>
                    <span className={model.supportsGrounding ? "text-green-400 font-semibold" : "text-gray-500"}>
                      {model.supportsGrounding ? "Supported" : "N/A"}
                    </span>
                  </div>

                  {model.reasoningBudget && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Logic & Thinking:</span>
                      <span className="text-amber-300 font-semibold">{model.reasoningBudget}</span>
                    </div>
                  )}
                </div>

                {/* Key Strengths */}
                <div className="pt-2">
                  <div className="text-[10px] text-gray-500 font-semibold uppercase mb-1.5">Key Capabilities</div>
                  <div className="flex flex-wrap gap-1.5">
                    {model.strengths.map((str, idx) => (
                      <span key={idx} className="text-[10px] bg-gray-800 text-gray-300 px-2 py-0.5 rounded-md border border-gray-700">
                        {str}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-gray-800/60 mt-auto">
                <button
                  onClick={() => handleChooseModel(model)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-purple-600 text-white cursor-default shadow-md shadow-purple-600/20'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 size={14} className="text-green-300" />
                      <span>Active Default Backend</span>
                    </>
                  ) : (
                    <>
                      <span>Select {model.name}</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
