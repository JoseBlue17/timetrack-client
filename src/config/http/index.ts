import axios, { AxiosError, type AxiosInstance, HttpStatusCode, isAxiosError } from 'axios';

export interface ApiError {
  name: Record<string, string>;
  code: string | number;
  message: string;
  request: {
    url: string;
  };
}

export type AxiosResponseError = AxiosError<ApiError>;

const baseURL = import.meta.env.VITE_API_URL as string;

export const Http: AxiosInstance = axios.create({ baseURL });

export const PublicHttp: AxiosInstance = axios.create({ baseURL });

export const isDomainBackendError = <T = unknown, D = unknown>(
  error: unknown,
): error is AxiosError<T, D> =>
  isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity;

Http.interceptors.response.use(
  (response) => response,
  (error: AxiosResponseError) => {
    if (isAxiosError(error)) {
      const requestUrl = error.config?.url ?? 'URL desconocida';
      console.error(`Error en petición a ${requestUrl}:`, error);
    }
    return Promise.reject(error);
  },
);

PublicHttp.interceptors.response.use(
  (response) => response,
  (error: AxiosResponseError) => {
    if (isAxiosError(error)) {
      const requestUrl = error.config?.url ?? 'URL desconocida';
      console.error(`Error en petición pública a ${requestUrl}:`, error);
    }
    return Promise.reject(error);
  },
);
