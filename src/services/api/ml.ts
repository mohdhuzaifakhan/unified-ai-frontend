import { mlApi } from './client';

export interface PredictionRequest {
    modelId: string;
    data: Record<string, any>;
}

export interface BatchPredictionRequest {
    modelId: string;
    data: Array<Record<string, any>>;
}

export interface PredictionResponse {
    prediction: any[];
    predictionProba?: number[][];
}

export interface BatchPredictionResponse {
    predictions: any[];
    count: number;
}

export interface PreprocessRequest {
    dataSourceId: string;
    config: {
        scaling?: {
            type: 'standard' | 'minmax' | 'robust';
            columns: string[];
        };
        encoding?: {
            columns: string[];
        };
        fillMissing?: {
            strategy: 'mean' | 'median' | 'mode' | 'zero' | 'forward_fill';
        };
    };
}

export interface Deployment {
    _id: string;
    name: string;
    description?: string;
    modelId: string;
    projectId: string;
    userId: string;
    version: string;
    status: 'pending' | 'active' | 'inactive' | 'failed';
    endpoint?: string;
    config: Record<string, any>;
    healthMetrics: Record<string, any>;
    lastHealthCheck?: string;
    requestCount: number;
    createdAt: string;
    updatedAt: string;
}

export const predictionsApi = {
    predict: async (data: PredictionRequest): Promise<PredictionResponse> => {
        const response = await mlApi.post('/predictions/predict', data);
        return response.data;
    },

    batchPredict: async (data: BatchPredictionRequest): Promise<BatchPredictionResponse> => {
        const response = await mlApi.post('/predictions/batch', data);
        return response.data;
    },
};

export const preprocessingApi = {
    preprocess: async (data: PreprocessRequest): Promise<{ message: string; dataSourceId: string; shape: number[] }> => {
        const response = await mlApi.post('/preprocessing/preprocess', data);
        return response.data;
    },

    getConfig: async (): Promise<Record<string, string[]>> => {
        const response = await mlApi.get('/preprocessing/config');
        return response.data;
    },
};

export const deploymentsApi = {
    getAll: async (projectId?: string): Promise<Deployment[]> => {
        const params = projectId ? { projectId } : {};
        const response = await mlApi.get('/deployments', { params });
        return response.data;
    },

    getById: async (id: string): Promise<Deployment> => {
        const response = await mlApi.get(`/deployments/${id}`);
        return response.data;
    },

    create: async (data: {
        modelId: string;
        projectId: string;
        name: string;
        description?: string;
        config?: Record<string, any>;
    }): Promise<{ message: string; deploymentId: string; endpoint: string }> => {
        const response = await mlApi.post('/deployments', data);
        return response.data;
    },

    checkHealth: async (id: string): Promise<{ status: string; deploymentId: string; requestCount: number }> => {
        const response = await mlApi.get(`/deployments/${id}/health`);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await mlApi.delete(`/deployments/${id}`);
    },
};
