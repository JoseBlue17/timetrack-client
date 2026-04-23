export * from './http';

const config = {
  api: import.meta.env.VITE_API_URL as string,
  isDevelopment: import.meta.env.DEV,
};

export const { api } = config;

export default config;
