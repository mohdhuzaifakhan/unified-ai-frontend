import { mlApi } from './client';

export interface Model {
    _id: string;
    name: string;
    description?: string;
    projectId: string;
    userId: string;
    version: string;
    type: 'classification' | 'regression' | 'clustering' | 'other';
    algorithm: string;
    hyperparameters: Record<string, any>;
    metrics: Record<string, any>;
    modelPath: string;
    status: string;
    metadata: Record<string, any>;
    dataSourceId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AutoMLRequest {
    projectId: string;
    dataSourceId: string;
    targetColumn: string;
    problemType: 'classification' | 'regression';
}

export interface AutoMLResponse {
    message: string;
    modelId: string;
    bestAlgorithm: string;
    results: Array<{
        algorithm: string;
        score: number;
        metrics: Record<string, any>;
    }>;
}

export const modelsApi = {
    getAll: async (projectId?: string): Promise<Model[]> => {
        const params = projectId ? { projectId } : {};
        const response = await mlApi.get('/models', { params });
        return response.data;
    },

    getById: async (id: string): Promise<Model> => {
        const response = await mlApi.get(`/models/${id}`);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await mlApi.delete(`/models/${id}`);
    },

    download: async (id: string): Promise<Blob> => {
        const response = await mlApi.get(`/models/${id}/download`, {
            responseType: 'blob',
        });
        return response.data;
    },

    startAutoML: async (data: AutoMLRequest): Promise<AutoMLResponse> => {
        const response = await mlApi.post('/automl/start', data);
        return response.data;
    },
};
