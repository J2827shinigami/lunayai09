import { Persona, AIModelInfo, MemoryItem, ChannelIntegration } from './types';

export const PERSONAS: Persona[] = [
  {
    id: 'luna-omni',
    name: 'Luna AI Assistant',
    icon: 'Moon',
    category: 'general',
    description: 'General purpose day-to-day assistant with live search, task planning, and multi-model routing.',
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
    description: 'Knowledgeable on OpenClaw, Gemini 2.5, ChatGPT (GPT-4o/o3-mini), Claude 3.5/3.7, DeepSeek R1, and Ollama.',
    prompt: 'You are Luna AI - Model Specialist. You know everything about contemporary AI models including OpenClaw Agent Core, Google Gemini 2.5/3.1, Anthropic Claude 3.5 & 3.7 Sonnet, OpenAI ChatGPT (GPT-4o, ChatGPT o3-mini), DeepSeek R1, Llama 3.3, and local Ollama setups. Compare cost, latency, context windows, and tool usage across platforms.'
  }
];

export const CURRENT_AI_MODELS: AIModelInfo[] = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    icon: 'Sparkles',
    contextWindow: '1,000,000+ tokens',
    strengths: ['Search Grounding', 'Ultra Low Latency', 'Reasoning & Thinking Budget', 'Multimodal Vision'],
    supportsGrounding: true,
    supportsVision: true,
    reasoningBudget: 'Dynamic Thinking',
    status: 'active',
    latencyRating: 'Ultra Fast',
    description: 'The default ultra-fast multimodal engine powering Luna AI with native Google Search grounding and 1M token context.'
  },
  {
    id: 'openclaw-agent-core',
    name: 'OpenClaw Persistent Agent Core',
    provider: 'OpenClaw Agent Engine',
    icon: 'Bot',
    contextWindow: '200,000 tokens',
    strengths: ['Persistent Long-Term Memory', 'Browser & Shell Automation', 'Multi-Channel Messaging Bridge', 'Local/Cloud Self-Hosting'],
    supportsGrounding: true,
    supportsVision: true,
    reasoningBudget: 'Autonomous Workflow',
    status: 'available',
    latencyRating: 'Fast',
    description: 'Open-source autonomous AI agent architecture supporting persistent state across Slack, Discord, Telegram, and Web.'
  },
  {
    id: 'chatgpt-gpt4o',
    name: 'ChatGPT (GPT-4o Omni)',
    provider: 'OpenAI (ChatGPT)',
    icon: 'MessageSquare',
    contextWindow: '128,000 tokens',
    strengths: ['Conversational Natural Fluency', 'Multimodal Code Generation', 'Custom GPT Tools', 'Structured Function Calling'],
    supportsGrounding: true,
    supportsVision: true,
    status: 'available',
    latencyRating: 'Fast',
    description: 'Flagship multimodal flagship model from OpenAI powering ChatGPT conversations, structured JSON, and code synthesis.'
  },
  {
    id: 'chatgpt-o3-mini',
    name: 'ChatGPT o3-mini Reasoning',
    provider: 'OpenAI (ChatGPT)',
    icon: 'Cpu',
    contextWindow: '200,000 tokens',
    strengths: ['Math & STEM Deep Logic', 'Competitive Coding', 'Chain-of-Thought Reasoning', 'Optimized Latency'],
    supportsGrounding: false,
    supportsVision: false,
    reasoningBudget: 'High Reasoning',
    status: 'available',
    latencyRating: 'Deep Reasoning',
    description: 'OpenAI’s latest reasoning model engineered for complex science, math, software debugging, and multi-step logic.'
  },
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet Hybrid',
    provider: 'Anthropic (Claude)',
    icon: 'Layers',
    contextWindow: '200,000 tokens',
    strengths: ['Hybrid Thinking & Instant Response', 'Full App Coding', 'Nuanced Writing', 'Detailed System Architecture'],
    supportsGrounding: false,
    supportsVision: true,
    reasoningBudget: 'Configurable Thinking',
    status: 'available',
    latencyRating: 'Fast',
    description: 'Anthropic’s flagship hybrid model combining immediate conversational response with extended chain-of-thought reasoning.'
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic (Claude)',
    icon: 'Layers',
    contextWindow: '200,000 tokens',
    strengths: ['Agentic Frontend Coding', 'Artifact Rendering', 'Complex Text Analysis', 'High Precision Instruction Following'],
    supportsGrounding: false,
    supportsVision: true,
    status: 'available',
    latencyRating: 'Fast',
    description: 'Industry benchmark model for code generation, document parsing, and complex agentic UI workflows.'
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1 Reasoning',
    provider: 'DeepSeek',
    icon: 'Terminal',
    contextWindow: '128,000 tokens',
    strengths: ['Open-Weights Chain of Thought', 'Cost-Effective Math & Code', 'Self-Verification Logic', 'Open Benchmark Leader'],
    supportsGrounding: false,
    supportsVision: false,
    reasoningBudget: 'Deep Reasoning',
    status: 'available',
    latencyRating: 'Deep Reasoning',
    description: 'First-tier open reasoning model trained via reinforcement learning for logic, coding, and mathematical verification.'
  },
  {
    id: 'gemini-3.1-flash-image',
    name: 'Gemini 3.1 Flash Image (Nano Banana)',
    provider: 'Google',
    icon: 'Sparkles',
    contextWindow: '128,000 tokens',
    strengths: ['High Precision Image Generation', 'Interactive Inpainting & Editing', 'Text-to-Image Multimodal Synthesis'],
    supportsGrounding: false,
    supportsVision: true,
    status: 'available',
    latencyRating: 'Fast',
    description: 'Specialized visual generation model for creating and modifying high-fidelity images based on text prompts.'
  },
  {
    id: 'llama-3-3-70b',
    name: 'Llama 3.3 70B (Local Ollama)',
    provider: 'Meta / Ollama',
    icon: 'Server',
    contextWindow: '128,000 tokens',
    strengths: ['100% On-Premise Privacy', 'Zero API Costs', 'Offline Infrastructure', 'Open Source Model weights'],
    supportsGrounding: false,
    supportsVision: false,
    status: 'local',
    latencyRating: 'Balanced',
    description: 'Run locally on your own GPU workstation or local server node via Ollama integration for complete data isolation.'
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
    name: 'Luna AI Global Netlify Gateway',
    iconName: 'Globe',
    status: 'connected',
    endpoint: 'https://lunaai09.netlify.app/#public',
    description: 'Directly accessible web portal hosted live on Netlify for visitors globally.'
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
