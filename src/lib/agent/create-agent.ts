import { Agent } from '@mariozechner/pi-agent-core';
import { getModel } from '@mariozechner/pi-ai';
import type { Message } from '@mariozechner/pi-ai';
import type { AgentMessage } from '@mariozechner/pi-agent-core';
import { GRILL_ME_SYSTEM_PROMPT } from './system-prompt';
import { allTools } from './tools';

export interface CreateAgentOptions {
  apiKey?: string;
  provider?: string;
  modelId?: string;
}

export function createAgent(options: CreateAgentOptions = {}): Agent {
  const provider = (options.provider || 'anthropic') as 'anthropic';
  const defaultModelId = 'claude-sonnet-4-20250514' as const;
  const modelId = (options.modelId || defaultModelId) as typeof defaultModelId;

  const model = getModel(provider, modelId);

  const agent = new Agent({
    initialState: {
      systemPrompt: GRILL_ME_SYSTEM_PROMPT,
      model,
      tools: allTools,
      messages: [],
    },
    convertToLlm: (msgs: AgentMessage[]): Message[] => {
      return msgs
        .filter((m) => ['user', 'assistant', 'toolResult'].includes(m.role))
        .map((m) => m as unknown as Message);
    },
    getApiKey: async (providerName: string) => {
      try {
        const { getAppStorage } = await import('@mariozechner/pi-web-ui');
        return await getAppStorage().providerKeys.get(providerName) || undefined;
      } catch {
        return undefined;
      }
    },
  });

  return agent;
}
