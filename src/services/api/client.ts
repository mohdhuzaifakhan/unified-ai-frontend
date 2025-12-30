import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const CORE_API_URL = import.meta.env.VITE_CORE_API_URL || 'http://localhost:3001/api';
const ML_API_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:3002/api/ml';

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


const requestInterceptor = (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
    }


    return config;
};

const responseErrorInterceptor = async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

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

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                }
                return axios(originalRequest);
            }
        } catch (refreshError) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
};

coreApi.interceptors.request.use(requestInterceptor);
coreApi.interceptors.response.use((response) => response, responseErrorInterceptor);

mlApi.interceptors.request.use(requestInterceptor);
mlApi.interceptors.response.use((response) => response, responseErrorInterceptor);

export { coreApi, mlApi };
