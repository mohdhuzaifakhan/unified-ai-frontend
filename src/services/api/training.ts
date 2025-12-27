import { mlApi } from './client';

export interface TrainingJob {
    _id: string;
    projectId: string;
    userId: string;
    dataSourceId: string;
    modelId?: string;
    jobType: 'automl' | 'custom' | 'transfer_learning';
    status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
    config: Record<string, any>;
    progress: number;
    currentMetrics: Record<string, any>;
    errorMessage?: string;
    startedAt?: string;
    completedAt?: string;
    logs: Array<{ timestamp: string; message: string; level: string }>;
    createdAt: string;
    updatedAt: string;
}

export interface StartTrainingRequest {
    projectId: string;
    dataSourceId: string;
    config: Record<string, any>;
}

export const trainingApi = {
    start: async (data: StartTrainingRequest): Promise<{ message: string; jobId: string; status: string }> => {
        const response = await mlApi.post('/training/start', data);
        return response.data;
    },

    getProgress: async (jobId: string): Promise<TrainingJob> => {
        const response = await mlApi.get(`/training/progress/${jobId}`);
        return response.data;
    },

    getJobs: async (projectId?: string): Promise<TrainingJob[]> => {
        const params = projectId ? { projectId } : {};
        const response = await mlApi.get('/training/jobs', { params });
        return response.data;
    },
};
