import { coreApi as client } from './client';

export interface DashboardStat {
  label: string;
  value: string;
  trend: string;
  color: string;
}

export interface ProjectOption {
  _id: string;
  name: string;
}

export interface EmbeddingExperiment {
  id: string;
  embeddingModel: string;
  vectorStore: string;
  datasource?: string;
  chunksStored: number;
  status: string;
  chunkSize?: number;
  chunkOverlap?: number;
  createdAt: string;
}

export interface RagHealth {
  embeddingQueue: 'Healthy' | 'Busy';
  vectorIndex: 'Ready' | 'Building';
  lastIngestionAt: string | null;
}

export const dashboardApi = {
  getRagStats: async (projectId?: string): Promise<DashboardStat[]> => {
    const res = await client.get('/dashboard/rag/stats', {
      params: projectId ? { projectId } : {},
    });
    return res.data;
  },

  getEmbeddingExperiments: async (
    projectId: string,
  ): Promise<EmbeddingExperiment[]> => {
    const res = await client.get('/dashboard/embedding-experiments', {
      params: { projectId },
    });
    return res.data;
  },

  getRagHealth: async (projectId: string): Promise<RagHealth> => {
    const res = await client.get('/dashboard/rag/health', {
      params: { projectId },
    });
    return res.data;
  },

  getProjects: async (): Promise<ProjectOption[]> => {
    const res = await client.get('/dashboard/projects');
    return res.data;
  },
};
