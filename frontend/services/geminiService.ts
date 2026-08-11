import { GoogleGenAI } from '@google/genai';
import { GroundingChunk, MemoryItem } from '../types';

// Initialize the Google GenAI SDK.
// Assumes process.env.API_KEY is available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

let conversationHistory: any[] = [];

export const resetConversation = () => {
  conversationHistory = [];
};

// Retry helper with exponential backoff for API resilience
const callWithRetry = async <T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (error: any) {
      attempt++;
      const status = error?.status || error?.statusCode;
      const isRateLimitOrServer = !status || status === 429 || status >= 500;
      if (attempt >= retries || !isRateLimitOrServer) {
        throw error;
      }
      const backoff = delay * Math.pow(2, attempt - 1) + Math.random() * 200;
      await new Promise((res) => setTimeout(res, backoff));
    }
  }
};

export const sendMessageStream = async function* (
  text: string,
  baseSystemInstruction: string,
  memories: MemoryItem[] = [],
  fileData?: { mimeType: string; data: string }
) {
  // Build system prompt with injected persistent memories (OpenClaw Persistent Memory Feature)
  let fullSystemInstruction = baseSystemInstruction;
  if (memories.length > 0) {
    const memoryFormatted = memories
      .map(m => `- [${m.category.toUpperCase()}] ${m.key}: ${m.value}`)
      .join('\n');
    fullSystemInstruction += `\n\n### PERSISTENT MEMORY STORE (User & System Context):\nYou have access to the following stored long-term memory facts:\n${memoryFormatted}\nUse these stored facts whenever relevant to personalize answers.`;
  }

  const userParts: any[] = [];
  
  if (fileData) {
    userParts.push({
      inlineData: {
        mimeType: fileData.mimeType,
        data: fileData.data,
      },
    });
  }
  
  if (text.trim()) {
    userParts.push({ text });
  }

  const newContents = [...conversationHistory, { role: 'user', parts: userParts }];

  const responseStream = await callWithRetry(() =>
    ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: newContents,
      config: {
        systemInstruction: fullSystemInstruction,
        tools: [{ googleSearch: {} }], // Live web search grounding
      },
    })
  );

  let fullResponseText = "";
  let groundingChunks: GroundingChunk[] = [];

  for await (const chunk of responseStream) {
    if (chunk.text) {
      fullResponseText += chunk.text;
    }
    
    const chunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && chunks.length > 0) {
      groundingChunks = chunks;
    }

    yield {
      text: chunk.text || '',
      groundingChunks: groundingChunks.length > 0 ? groundingChunks : undefined
    };
  }

  // Update conversation history after successful response
  conversationHistory = newContents;
  conversationHistory.push({ role: 'model', parts: [{ text: fullResponseText }] });
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      }
    };
    reader.onerror = error => reject(error);
  });
};
