import React, { useState, useRef } from 'react';
import { Send, Paperclip, X, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string, file?: File) => void;
  disabled: boolean;
}

const QUICK_PROMPTS = [
  "What can Luna AI do?",
  "Compare Gemini 2.5 vs Claude 3.5 Sonnet",
  "Write a PowerShell script to inspect server CPU load",
  "Summarize today's top AI tech news"
];

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith('image/')) {
        setFile(selectedFile);
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
      } else {
        alert('Please attach an image file (PNG, JPEG, WebP).');
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!text.trim() && !file) || disabled) return;
    
    onSend(text, file || undefined);
    setText('');
    removeFile();
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
  };

  return (
    <div className="p-4 bg-gray-900 border-t border-gray-800">
      <div className="max-w-4xl mx-auto">
        
        {/* Quick prompt suggestions when empty */}
        {!text && !file && (
          <div className="hidden sm:flex flex-wrap gap-2 mb-3">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setText(prompt);
                  textareaRef.current?.focus();
                }}
                className="text-xs bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white px-3 py-1.5 rounded-full border border-gray-700/80 transition-all flex items-center gap-1.5"
              >
                <Sparkles size={12} className="text-purple-400" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>
        )}

        {/* Attachment Preview */}
        {previewUrl && (
          <div className="mb-2 p-2 bg-gray-800 rounded-lg border border-gray-700 inline-flex items-center gap-3 shadow-lg">
            <img src={previewUrl} alt="Preview" className="h-12 w-12 object-cover rounded-md" />
            <div className="text-xs text-gray-300 max-w-[200px] truncate">
              {file?.name}
            </div>
            <button 
              onClick={removeFile}
              className="p-1 text-gray-400 hover:text-red-400 rounded-full hover:bg-gray-700 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <form 
          onSubmit={handleSubmit}
          className="flex items-end gap-2 bg-gray-850 rounded-xl border border-gray-700 p-2 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all shadow-lg"
        >
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="p-2.5 text-gray-400 hover:text-gray-100 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
            title="Attach Image"
          >
            <Paperclip size={20} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />

          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask Luna AI anything... (Shift+Enter for new line)"
            disabled={disabled}
            rows={1}
            className="flex-1 max-h-[180px] bg-transparent text-gray-100 placeholder-gray-500 resize-none outline-none py-2 px-2 text-sm sm:text-base disabled:opacity-50"
            style={{ minHeight: '40px' }}
          />

          <button
            type="submit"
            disabled={disabled || (!text.trim() && !file)}
            className="p-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg transition-all disabled:opacity-40 flex-shrink-0 shadow-md shadow-purple-600/20"
          >
            <Send size={18} />
          </button>
        </form>
        <div className="flex items-center justify-between mt-2 text-[11px] text-gray-500 px-1">
          <span>Powered by Luna AI + Gemini 2.5 Flash</span>
          <span className="hidden sm:inline">Web Search Grounded</span>
        </div>
      </div>
    </div>
  );
};