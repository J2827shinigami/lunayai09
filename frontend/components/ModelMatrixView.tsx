import React from 'react';
import { Layers, CheckCircle2, Zap, Shield, Cpu, ExternalLink } from 'lucide-react';
import { CURRENT_AI_MODELS } from '../constants';

export const ModelMatrixView: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Matrix Header */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-2">
        <div className="flex items-center gap-2 font-bold text-lg text-gray-100">
          <Layers className="text-blue-400" size={20} />
          <span>Supported AI Model Knowledge Architecture</span>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          OmniClaw prevents vendor lock-in by supporting multi-provider LLM backends. You can switch models depending on task requirements—such as low-latency chat with Gemini 2.5 Flash, image synthesis with Gemini 3.1 Flash Image, or local offline processing via Ollama.
        </p>
      </div>

      {/* Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CURRENT_AI_MODELS.map((model) => (
          <div 
            key={model.id} 
            className={`bg-gray-900 border rounded-2xl p-5 space-y-3 relative overflow-hidden ${
              model.status === 'active' ? 'border-blue-500/50 shadow-lg shadow-blue-500/10' : 'border-gray-800'
            }`}
          >
            {model.status === 'active' && (
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                Current Active Engine
              </div>
            )}

            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gray-800 rounded-xl text-blue-400">
                <Cpu size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-100">{model.name}</h3>
                <p className="text-xs text-gray-400 font-mono">{model.provider}</p>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">{model.description}</p>

            <div className="pt-2 border-t border-gray-800/80 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-mono">Context Window:</span>
                <span className="text-blue-300 font-mono font-medium">{model.contextWindow}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-mono">Search Grounding:</span>
                <span className={model.supportsGrounding ? "text-green-400 font-medium" : "text-gray-500"}>
                  {model.supportsGrounding ? "Supported" : "N/A"}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-[10px] text-gray-500 font-semibold uppercase mb-1.5">Key Strengths</div>
              <div className="flex flex-wrap gap-1.5">
                {model.strengths.map((str, idx) => (
                  <span key={idx} className="text-[10px] bg-gray-800 text-gray-300 px-2 py-0.5 rounded-md border border-gray-700">
                    {str}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
