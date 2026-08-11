export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
  sources?: GroundingChunk[];
  attachment?: {
    mimeType: string;
    url: string;
  };
  timestamp?: string;
  modelEngine?: string;
}

export interface Persona {
  id: string;
  name: string;
  icon: string;
  description: string;
  prompt: string;
  category: 'general' | 'it' | 'research' | 'productivity';
}

export interface AIModelInfo {
  id: string;
  name: string;
  provider: 'Google' | 'OpenAI (ChatGPT)' | 'Anthropic (Claude)' | 'OpenClaw Agent Engine' | 'DeepSeek' | 'Meta / Ollama';
  icon: string;
  contextWindow: string;
  strengths: string[];
  supportsGrounding: boolean;
  supportsVision: boolean;
  reasoningBudget?: string;
  status: 'active' | 'available' | 'local';
  description: string;
  latencyRating: 'Ultra Fast' | 'Fast' | 'Balanced' | 'Deep Reasoning';
}

export interface MemoryItem {
  id: string;
  key: string;
  value: string;
  category: 'preference' | 'system_fact' | 'workflow' | 'credential';
  createdAt: string;
}

export interface ChannelIntegration {
  id: string;
  name: string;
  iconName: string;
  status: 'connected' | 'ready' | 'pending';
  endpoint: string;
  description: string;
}

export interface SMSDispatchStatus {
  phoneNumber: string;
  sentAt?: string;
  status: 'idle' | 'sending' | 'delivered' | 'failed';
  message: string;
}

export type ActiveTab = 'chat' | 'memory' | 'models' | 'deploy' | 'workflows';
