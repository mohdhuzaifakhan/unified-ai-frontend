import { coreApi as client } from './client';

export interface ModelConfigPayload {
  model: string;
  apiKey: string;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
}

export const modelConfigApi = {
  saveConfig: async (
    projectId: string,
    payload: ModelConfigPayload,
  ) => {
    const res = await client.post('/model-config', payload, {
      params: { projectId },
    });
    return res.data;
  },

  getConfig: async (projectId: string) => {
    const res = await client.get('/model-config', {
      params: { projectId },
    });
    return res.data;
  },
};
