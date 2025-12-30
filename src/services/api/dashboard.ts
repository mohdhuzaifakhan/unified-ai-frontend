import { coreApi as client } from './client';

export interface DashboardStat {
    label: string;
    value: string;
    trend: string;
    color: string;
}

export interface DashboardActivity {
    id: number;
    type: string;
    message: string;
    time: string;
}

export const dashboardApi = {
    getStats: async (): Promise<DashboardStat[]> => {
        const response = await client.get('/dashboard/stats');
        return response.data;
    },
    getActivities: async (): Promise<DashboardActivity[]> => {
        const response = await client.get('/dashboard/activities');
        return response.data;
    },
    getRagStats: async (): Promise<DashboardStat[]> => {
        const response = await client.get('/dashboard/rag/stats');
        return response.data;
    },
};
