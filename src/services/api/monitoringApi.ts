import { coreApi as client } from './client';

export interface RAGTrace {
    id: string;
    projectId: string;
    query: string;
    answer: string;
    contextChunks: string[];
    latency: number;
    score: number;
    status: string;
    createdAt: string;
}

export interface RAGMetrics {
    precision: number;
    faithfulness: number;
    relevance: number;
    avgLatency: number;
    totalQueries: number;
}

export const monitoringApi = {
    getTraces: async (projectId?: string, configId?: string, modelId?: string): Promise<RAGTrace[]> => {
        const res = await client.get('/monitoring/traces', {
            params: { projectId, configId, modelId }
        });
        return res.data;
    },

    getMetrics: async (projectId?: string, configId?: string, modelId?: string): Promise<RAGMetrics[]> => {
        const res = await client.get('/monitoring/metrics', {
            params: { projectId, configId, modelId }
        });
        return res.data;
    }
};
