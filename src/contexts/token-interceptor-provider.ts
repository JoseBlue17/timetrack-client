import { Http } from '@/config/http';
import { useContext, useEffect } from 'react';
import AppContext from '@/contexts/app-context';

export function TokenInterceptorProvider() {
  const { token } = useContext(AppContext);

  useEffect(() => {
    const interceptor = Http.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    return () => Http.interceptors.request.eject(interceptor);
  }, [token]);

  return null;
}
