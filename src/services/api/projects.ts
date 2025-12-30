import { coreApi } from './client';

export interface Project {
    _id: string;
    name: string;
    description?: string;
    type: string;
    userId: string;
    status: string;
    settings: Record<string, any>;
    collaborators: string[];
    metadata: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProjectData {
    name: string;
    description?: string;
    type?: string;
    settings?: Record<string, any>;
}

export interface UpdateProjectData {
    name?: string;
    description?: string;
    settings?: Record<string, any>;
    status?: string;
}

export const projectsApi = {
    getAll: async (type?: string): Promise<Project[]> => {
        const response = await coreApi.get('/projects', { params: { type } });
        return response.data;
    },

    getById: async (id: string): Promise<Project> => {
        const response = await coreApi.get(`/projects/${id}`);
        return response.data;
    },

    create: async (data: CreateProjectData): Promise<Project> => {
        const response = await coreApi.post('/projects', data);
        return response.data;
    },

    update: async (id: string, data: UpdateProjectData): Promise<Project> => {
        const response = await coreApi.patch(`/projects/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await coreApi.delete(`/projects/${id}`);
    },
};
