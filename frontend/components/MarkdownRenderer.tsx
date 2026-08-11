import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

// Safe copy helper to prevent Clipboard API permission errors
const safeCopyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback if Permissions Policy blocks navigator.clipboard
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

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = async (code: string, index: number) => {
    await safeCopyToClipboard(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="text-sm leading-relaxed space-y-3 text-gray-200">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const codeContent = part.slice(3, -3);
          const firstNewline = codeContent.indexOf('\n');
          const language = firstNewline > -1 ? codeContent.slice(0, firstNewline).trim() : '';
          const code = firstNewline > -1 ? codeContent.slice(firstNewline + 1) : codeContent;

          return (
            <div key={index} className="relative bg-gray-950 rounded-lg my-3 border border-gray-800 overflow-hidden shadow-md">
              <div className="bg-gray-900 text-gray-400 text-xs px-3 py-1.5 border-b border-gray-800 flex justify-between items-center font-mono">
                <span>{language || 'code'}</span>
                <button
                  onClick={() => handleCopyCode(code, index)}
                  className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors py-0.5 px-2 rounded hover:bg-gray-800"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check size={12} className="text-green-400" />
                      <span className="text-green-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-green-400 font-mono text-xs sm:text-sm">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        const formattedText = part
          .split(/(\*\*.*?\*\*|`.*?`|\n)/g)
          .map((subPart, subIndex) => {
            if (subPart === '\n') {
              return <br key={subIndex} />;
            }
            if (subPart.startsWith('**') && subPart.endsWith('**')) {
              return <strong key={subIndex} className="font-semibold text-white">{subPart.slice(2, -2)}</strong>;
            }
            if (subPart.startsWith('`') && subPart.endsWith('`')) {
              return <code key={subIndex} className="bg-gray-800 text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono border border-gray-700">{subPart.slice(1, -1)}</code>;
            }
            if (subPart.match(/https?:\/\/[^\s]+/)) {
              const url = subPart.match(/https?:\/\/[^\s]+/)?.[0] || '';
              const rest = subPart.replace(url, '');
              return (
                <React.Fragment key={subIndex}>
                  <a href={url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-0.5">{url}</a>
                  {rest}
                </React.Fragment>
              );
            }
            return <span key={subIndex}>{subPart}</span>;
          });

        return <div key={index} className="whitespace-pre-wrap">{formattedText}</div>;
      })}
    </div>
  );
};
