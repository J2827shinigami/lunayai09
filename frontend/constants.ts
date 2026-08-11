import { Persona, AIModelInfo, MemoryItem, ChannelIntegration } from './types';

export const PERSONAS: Persona[] = [
  {
    id: 'luna-omni',
    name: 'Luna AI Assistant',
    icon: 'Moon',
    category: 'general',
    description: 'General purpose day-to-day assistant with live search, task planning, and advice.',
    prompt: 'You are Luna AI, an advanced open agent assistant inspired by OpenClaw architecture. You have persistent long-term memory and live web search capabilities. Answer user questions accurately with up-to-date information, formatted neatly in markdown with clear structure and action steps when needed.'
  },
  {
    id: 'it-support',
    name: 'IT Support & DevOps',
    icon: 'Terminal',
    category: 'it',
    description: 'Troubleshooting scripts, shell commands, ticketing automation, and cloud support.',
    prompt: 'You are Luna AI - IT Operations & DevOps Specialist. Help users generate bash, PowerShell, Python scripts, debug server errors, summarize support tickets, and optimize IT workflows. Always provide code snippets inside formatted markdown code blocks with clear explanations.'
  },
  {
    id: 'researcher',
    name: 'Deep Researcher',
    icon: 'BookOpen',
    category: 'research',
    description: 'Thorough topic analysis, trend reporting, and verified web citations.',
    prompt: 'You are Luna AI - Senior Research Analyst. Conduct deep analysis on topics requested by the user. Use Google Search to get real-time facts, cite web sources, compare competing opinions, and format output into structured markdown executive summaries.'
  },
  {
    id: 'ai-architect',
    name: 'AI Model Specialist',
    icon: 'Cpu',
    category: 'productivity',
    description: 'Knowledgeable on Gemini 2.5, Claude 3.5, GPT-4o, DeepSeek, and Ollama.',
    prompt: 'You are Luna AI - Model Specialist. You know everything about contemporary AI models including Google Gemini 2.5/3.1, Anthropic Claude 3.5 Sonnet, OpenAI GPT-4o, DeepSeek R1, Llama 3.3, and local Ollama setups. Compare cost, latency, context windows, and tool usage across platforms.'
  }
];

export const CURRENT_AI_MODELS: AIModelInfo[] = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google Vertex AI',
    contextWindow: '1,000,000+ tokens',
    strengths: ['Ultra fast latency', 'Search Grounding', 'Reasoning & Thinking Budget', 'Multimodal'],
    supportsGrounding: true,
    status: 'active',
    description: 'The primary engine powering Luna AI. Offers native Google Search grounding, multi-step planning, and multimodal vision support.'
  },
  {
    id: 'gemini-3.1-flash-image',
    name: 'Gemini 3.1 Flash Image',
    provider: 'Google Vertex AI',
    contextWindow: '128k tokens',
    strengths: ['High Quality Image Gen', 'Image Editing & Inpainting', 'Multi-turn Vision'],
    supportsGrounding: false,
    status: 'available',
    description: 'Specialized model for image synthesis and precise visual edits based on text prompts.'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI (Omni Channel Bridge)',
    contextWindow: '128k tokens',
    strengths: ['Conversational fluency', 'Code generation', 'Tool calling'],
    supportsGrounding: false,
    status: 'available',
    description: 'Supported via Luna AI multi-provider bridge architecture.'
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic (Omni Channel Bridge)',
    contextWindow: '200k tokens',
    strengths: ['Complex agentic coding', 'Nuanced writing', 'Artifact rendering'],
    supportsGrounding: false,
    status: 'available',
    description: 'Popular choice for complex engineering workflows and document drafting.'
  },
  {
    id: 'llama-3-3-70b',
    name: 'Llama 3.3 (Local Ollama)',
    provider: 'Self-Hosted Local Node',
    contextWindow: '128k tokens',
    strengths: ['100% Privacy', 'Offline operational', 'Zero API cost'],
    supportsGrounding: false,
    status: 'local',
    description: 'Run locally on your own workstation or GPU instance via Ollama integration.'
  }
];

export const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    key: 'Organization Tech Stack',
    value: 'React, TypeScript, Tailwind CSS, Python, Docker, Cloudflare Workers',
    category: 'system_fact',
    createdAt: new Date().toLocaleDateString()
  },
  {
    id: 'mem-2',
    key: 'User Work Routine',
    value: 'Daily standup at 9:30 AM EST. Weekly deploy on Thursdays.',
    category: 'preference',
    createdAt: new Date().toLocaleDateString()
  },
  {
    id: 'mem-3',
    key: 'Support Escalation Policy',
    value: 'P1 incidents go to Slack #incident-room and page on-call via Webhook.',
    category: 'workflow',
    createdAt: new Date().toLocaleDateString()
  }
];

export const CHANNEL_INTEGRATIONS: ChannelIntegration[] = [
  {
    id: 'web-public',
    name: 'Luna AI Global Web Gateway',
    iconName: 'Globe',
    status: 'connected',
    endpoint: '#public',
    description: 'Directly accessible web portal for visitors on any device globally.'
  },
  {
    id: 'telegram',
    name: 'Luna Telegram Bot',
    iconName: 'Send',
    status: 'ready',
    endpoint: '#telegram-bridge',
    description: 'Chat directly with Luna AI on Telegram mobile & desktop.'
  },
  {
    id: 'discord',
    name: 'Luna Discord Guild Bot',
    iconName: 'MessageSquare',
    status: 'ready',
    endpoint: '#discord-bridge',
    description: 'Automate support channels and query Luna AI in server threads.'
  },
  {
    id: 'whatsapp',
    name: 'Luna WhatsApp Business API',
    iconName: 'Smartphone',
    status: 'ready',
    endpoint: '#whatsapp-bridge',
    description: 'Receive text and voice notes directly in your WhatsApp app.'
  },
  {
    id: 'slack',
    name: 'Luna Slack Workspace App',
    iconName: 'Slack',
    status: 'ready',
    endpoint: '#slack-bridge',
    description: 'Integrate into team workflows, ticket summaries, and standups.'
  }
];