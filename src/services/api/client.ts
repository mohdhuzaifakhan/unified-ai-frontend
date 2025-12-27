import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';

// API Base URLs
const CORE_API_URL = import.meta.env.VITE_CORE_API_URL || 'http://localhost:3001/api';
const ML_API_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:3002/api/ml';

// Create axios instances
const coreApi: AxiosInstance = axios.create({
    baseURL: CORE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const mlApi: AxiosInstance = axios.create({
    baseURL: ML_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
const requestInterceptor = (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

// Response interceptor for error handling and token refresh
const responseErrorInterceptor = async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                const response = await axios.post(`${CORE_API_URL}/auth/refresh`, {
                    refreshToken,
                });

                const { accessToken } = response.data;
                localStorage.setItem('accessToken', accessToken);

                // Retry original request with new token
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                }
                return axios(originalRequest);
            }
        } catch (refreshError) {
            // Refresh failed, logout user
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
};

// Add interceptors to both instances
coreApi.interceptors.request.use(requestInterceptor);
coreApi.interceptors.response.use((response) => response, responseErrorInterceptor);

mlApi.interceptors.request.use(requestInterceptor);
mlApi.interceptors.response.use((response) => response, responseErrorInterceptor);

export { coreApi, mlApi };
