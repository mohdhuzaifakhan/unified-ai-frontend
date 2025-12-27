import { coreApi } from './client';

export interface DataSource {
    _id: string;
    name: string;
    description?: string;
    projectId: string;
    userId: string;
    type: 'file' | 's3' | 'database' | 'api';
    config: Record<string, any>;
    filePath?: string;
    fileSize?: number;
    fileType?: string;
    schema: Record<string, any>;
    status: string;
    errorMessage?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateDataSourceData {
    name: string;
    description?: string;
    projectId: string;
    type: 'file' | 's3' | 'database' | 'api';
    config: Record<string, any>;
}

export const dataSourcesApi = {
    getAll: async (projectId?: string): Promise<DataSource[]> => {
        const params = projectId ? { projectId } : {};
        const response = await coreApi.get('/data-sources', { params });
        return response.data;
    },

    getById: async (id: string): Promise<DataSource> => {
        const response = await coreApi.get(`/data-sources/${id}`);
        return response.data;
    },

    create: async (data: CreateDataSourceData): Promise<DataSource> => {
        const response = await coreApi.post('/data-sources', data);
        return response.data;
    },

    uploadFile: async (file: File, projectId: string): Promise<DataSource> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('projectId', projectId);

        const response = await coreApi.post('/data-sources/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    update: async (id: string, data: Partial<CreateDataSourceData>): Promise<DataSource> => {
        const response = await coreApi.patch(`/data-sources/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await coreApi.delete(`/data-sources/${id}`);
    },
};
