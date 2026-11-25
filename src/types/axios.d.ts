import 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    expectedSessionGeneration?: number;
  }
}
