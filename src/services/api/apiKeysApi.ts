import { coreApi as client } from './client';

export interface ApiKey {
  id: string;
  apiKeyName: string;
  prefix: string;
  key: string;
  projectId: string;
  projectName: string;
  domains: string[];
  createdAt: string;
  lastUsedAt?: string;
}

export interface CreateApiKeyPayload {
  apiKeyName: string;
  projectId: string;
  domains: string[];
}

export const apiKeysApi = {
  getKeys: async (projectId?: string): Promise<ApiKey[]> => {
    const res = await client.get('/keys', { params: { projectId } });
    console.log("res", res.data)
    return res.data;
  },

  createKey: async (
    payload: CreateApiKeyPayload
  ): Promise<{ message: string; apiKey: ApiKey; fullKey: string }> => {
    const res = await client.post('/keys', payload);
    return res.data;
  },

  deleteKey: async (id: string): Promise<{ message: string }> => {
    const res = await client.delete(`/keys/${id}`);
    return res.data;
  },
};
