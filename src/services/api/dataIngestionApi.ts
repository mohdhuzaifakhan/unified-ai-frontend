import { coreApi as client, mlApi as mlClient } from './client';

export interface DataIngestionConfig {
    projectId: string;
    chunk_size: number;
    chunk_overlap: number;
    separators: string[];
    embedding_model: string;
    vector_store: string;
    datasourceId: string
}

export const dataIngestionApi = {
    getConfig: async (projectId: string): Promise<DataIngestionConfig> => {
        const res = await client.get('/data-ingestion/config', { params: { projectId } });
        return res.data;
    },

    saveConfig: async (
        config: DataIngestionConfig,
    ): Promise<{ message: string }> => {
        const res = await client.post(
            '/data-ingestion/config',
            config,
        );
        return res.data;
    },

    getEmbeddingRuns: async (
        projectId: string,
    ) => {
        const res = await client.get('/data-ingestion/embedding/runs', { params: { projectId } });
        return res.data;
    },

    runPipeline: async (
        configId: string,
        datasourceId: string
    ): Promise<{ message: string }> => {
        const res = await mlClient.post('/rag/ingestion/run', {
            configId,
            datasourceId,
        });
        return res.data;
    },

    getAllEmbeddingsWithMetadataOfProject: async (
        projectId: string,
    ) => {
        const res = await client.get('/data-ingestion/embeddings/configs/datasource/metadata', { params: { projectId } });
        return res.data;
    },

};
