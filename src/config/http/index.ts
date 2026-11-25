import axios, {
  AxiosError,
  CanceledError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  isAxiosError,
} from 'axios';
import {
  getAuthToken,
  getSessionGeneration,
  invalidateSession,
  isCurrentSession,
} from '@/helpers/auth-session';

export interface HttpFieldError {
  name: string;
  errors: string[];
}

export interface ApiError {
  name?: Record<string, string>;
  fieldErrors?: HttpFieldError[];
  code: string | number;
  message: string;
  request?: {
    url: string;
  };
}

export type HttpError = AxiosError<ApiError>;

export type AxiosResponseError = HttpError;

function logHttpFailure(error: AxiosResponseError): void {
  if (!isAxiosError(error) || axios.isCancel(error)) return;

  console.error('HTTP request failed', {
    method: error.config?.method?.toUpperCase(),
    status: error.response?.status,
  });
}

const baseURL = import.meta.env.VITE_API_URL as string;
const requestSessions = new WeakMap<InternalAxiosRequestConfig, number>();

export const Http: AxiosInstance = axios.create({ baseURL, withCredentials: false });

export const PublicHttp: AxiosInstance = axios.create({ baseURL, withCredentials: false });

Http.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    const generation = config.expectedSessionGeneration ?? getSessionGeneration();
    if (!isCurrentSession(generation)) throw new CanceledError('Session changed');
    requestSessions.set(config, generation);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      config.headers.delete('Authorization');
    }
    return config;
  },
  (error: unknown) => {
    throw error;
  },
  { synchronous: true },
);

Http.interceptors.response.use(
  (response) => {
    const generation = requestSessions.get(response.config);
    if (generation !== undefined && !isCurrentSession(generation)) {
      throw new CanceledError('Session changed');
    }
    return response;
  },
  (error: AxiosResponseError) => {
    const generation = error.config && requestSessions.get(error.config);
    if (generation !== undefined && !isCurrentSession(generation)) {
      return Promise.reject(new CanceledError('Session changed'));
    }
    if (
      isAxiosError(error) &&
      error.response?.status === 401 &&
      generation !== undefined &&
      error.config?.headers.has('Authorization')
    ) {
      invalidateSession();
    }
    logHttpFailure(error);
    return Promise.reject(error);
  },
);

PublicHttp.interceptors.response.use(
  (response) => response,
  (error: AxiosResponseError) => {
    logHttpFailure(error);
    return Promise.reject(error);
  },
);
