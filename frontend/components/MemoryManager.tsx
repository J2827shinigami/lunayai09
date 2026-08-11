import React, { useState } from 'react';
import { Database, Plus, Trash2, Key, Info, Check } from 'lucide-react';
import { MemoryItem } from '../types';

interface MemoryManagerProps {
  memories: MemoryItem[];
  onAddMemory: (memory: Omit<MemoryItem, 'id' | 'createdAt'>) => void;
  onDeleteMemory: (id: string) => void;
}

export const MemoryManager: React.FC<MemoryManagerProps> = ({
  memories,
  onAddMemory,
  onDeleteMemory
}) => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [category, setCategory] = useState<MemoryItem['category']>('preference');
  const [showAdded, setShowAdded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim() || !value.trim()) return;

    onAddMemory({
      key: key.trim(),
      value: value.trim(),
      category
    });

    setKey('');
    setValue('');
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-2">
        <div className="flex items-center gap-2 font-bold text-lg text-gray-100">
          <Database className="text-blue-400" size={20} />
          <span>OpenClaw Persistent Memory Vault</span>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          Unlike standard conversational chatbots that forget context between sessions, OmniClaw retains these long-term system facts and user preferences across all multi-channel interactions. Saved memories are automatically injected into system instructions during chat generation.
        </p>
      </div>

      {/* Add New Memory Form */}
      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-1.5">
          <Plus size={16} className="text-green-400" />
          <span>Add New Context Memory</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Key / Fact Title</label>
            <input
              type="text"
              placeholder="e.g. AWS Deployment Region"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as MemoryItem['category'])}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 outline-none focus:border-blue-500"
            >
              <option value="preference">User Preference</option>
              <option value="system_fact">System Fact</option>
              <option value="workflow">Workflow Rule</option>
              <option value="credential">API / Tool Detail</option>
            </select>
          </div>

          <div className="sm:col-span-1">
            <label className="block text-xs font-medium text-gray-400 mb-1">Action</label>
            <button
              type="submit"
              disabled={!key.trim() || !value.trim()}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-xs py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              {showAdded ? <Check size={14} className="text-green-300" /> : <Plus size={14} />}
              <span>{showAdded ? 'Saved to Memory' : 'Store Fact'}</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Memory Value / Details</label>
          <textarea
            placeholder="e.g. Production environment runs on AWS us-east-1 with Kubernetes cluster."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={2}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 outline-none focus:border-blue-500 resize-none"
          />
        </div>
      </form>

      {/* Memory List Display */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Active Stored Memories ({memories.length})
        </h3>

        {memories.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-500 text-xs">
            No long-term memories currently stored. Add facts above to personalize responses.
          </div>
        ) : (
          <div className="space-y-2">
            {memories.map((mem) => (
              <div 
                key={mem.id} 
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-start justify-between gap-4 hover:border-gray-700 transition-colors"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-blue-300">{mem.key}</span>
                    <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded font-mono uppercase">
                      {mem.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{mem.value}</p>
                  <div className="text-[10px] text-gray-500 font-mono pt-1">
                    Added on {mem.createdAt}
                  </div>
                </div>

                <button
                  onClick={() => onDeleteMemory(mem.id)}
                  className="text-gray-500 hover:text-red-400 p-1.5 rounded hover:bg-gray-800 transition-colors"
                  title="Remove Memory"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
