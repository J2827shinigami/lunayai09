import { GoogleGenAI } from '@google/genai';
import { GroundingChunk, MemoryItem } from '../types';

// Initialize the Google GenAI SDK strictly per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

let conversationHistory: any[] = [];

export const resetConversation = () => {
  conversationHistory = [];
};

/**
 * Sanitizes contents for Gemini API:
 * 1. Ensures role is either 'user' or 'model'.
 * 2. Filters out empty parts.
 * 3. Enforces strict role alternation (user -> model -> user -> model).
 * 4. Ensures the first turn is always 'user'.
 */
const sanitizeContents = (contents: any[]): any[] => {
  const cleaned: any[] = [];

  for (const item of contents) {
    if (!item || !Array.isArray(item.parts)) continue;
    
    const validParts = item.parts.filter((part: any) => {
      if (!part) return false;
      if (typeof part.text === 'string') return part.text.trim().length > 0;
      if (part.inlineData) return !!part.inlineData.data;
      return true;
    });

    if (validParts.length === 0) continue;

    const role = item.role === 'model' ? 'model' : 'user';

    if (cleaned.length === 0) {
      if (role === 'user') {
        cleaned.push({ role, parts: validParts });
      }
    } else {
      const lastRole = cleaned[cleaned.length - 1].role;
      if (lastRole === role) {
        cleaned[cleaned.length - 1].parts.push(...validParts);
      } else {
        cleaned.push({ role, parts: validParts });
      }
    }
  }

  return cleaned;
};

export const sendMessageStream = async function* (
  text: string,
  baseSystemInstruction: string,
  memories: MemoryItem[] = [],
  fileData?: { mimeType: string; data: string },
  selectedModelEngine: string = 'Gemini 2.5 Flash'
) {
  let fullSystemInstruction = baseSystemInstruction;
  
  if (selectedModelEngine) {
    fullSystemInstruction += `\n\n### ACTIVE AI MODEL ENGINE CONTEXT:\nYou are currently operating as Luna AI using the '${selectedModelEngine}' model engine. Tailor your reasoning style, tone, and technical precision to match the highest standard expected of ${selectedModelEngine}.`;
  }

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
  
  const textContent = text.trim() || 'Hello';
  userParts.push({ text: textContent });

  const currentTurn = { role: 'user', parts: userParts };
  const rawContents = [...conversationHistory, currentTurn];
  let sanitized = sanitizeContents(rawContents);

  if (sanitized.length === 0) {
    sanitized = [currentTurn];
  }

  let responseStream: any = null;

  // Attempt 1: Stream with Search Grounding
  try {
    responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: sanitized,
      config: {
        systemInstruction: fullSystemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });
  } catch (err1) {
    console.warn("Stream with search grounding failed, attempting stream without grounding:", err1);
    // Attempt 2: Stream without Search Grounding
    try {
      responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: sanitized,
        config: {
          systemInstruction: fullSystemInstruction,
        },
      });
    } catch (err2) {
      console.warn("Stream with history failed, resetting history and attempting single turn prompt:", err2);
      // Attempt 3: Current turn only (resets any corrupt history)
      try {
        sanitized = [currentTurn];
        responseStream = await ai.models.generateContentStream({
          model: 'gemini-2.5-flash',
          contents: sanitized,
          config: {
            systemInstruction: fullSystemInstruction,
          },
        });
      } catch (err3) {
        console.error("All streaming attempts failed:", err3);
      }
    }
  }

  let fullResponseText = "";
  let groundingChunks: GroundingChunk[] = [];

  if (responseStream) {
    try {
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
    } catch (iterErr) {
      console.warn("Error during stream iteration:", iterErr);
    }
  }

  // Attempt 4: Non-streaming single generation fallback if stream produced no text
  if (!fullResponseText.trim()) {
    try {
      const singleResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [currentTurn],
        config: {
          systemInstruction: fullSystemInstruction,
        },
      });
      fullResponseText = singleResponse.text || "Hello! Luna AI is online and ready to assist you. How can I help today?";
      yield { text: fullResponseText };
    } catch (finalErr) {
      console.error("Final fallback generation failed:", finalErr);
      fullResponseText = "Hello! I am Luna AI. I experienced a momentary connection pause. Please try asking your question again!";
      yield { text: fullResponseText };
    }
  }

  // Save successful response into conversation history
  if (fullResponseText.trim() && !fullResponseText.includes("momentary connection pause")) {
    conversationHistory = sanitized;
    conversationHistory.push({
      role: 'model',
      parts: [{ text: fullResponseText.trim() }]
    });
  }
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
