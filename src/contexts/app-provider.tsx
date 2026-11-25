import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import AppContext from '@/contexts/app-context';
import type { IUser, IAppContext } from '@/interfaces';
import {
  getAuthToken,
  handleAuthStorageEvent,
  SESSION_INVALIDATED_EVENT,
} from '@/helpers/auth-session';

type IProvider = { children: ReactNode };

export const AppProvider = ({ children }: IProvider) => {
  const queryClient = useQueryClient();
  const [loggedUser, setLoggedUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const updateLoggedUser = useCallback((user: IUser | null) => setLoggedUser(user), []);
  const updateToken = useCallback((newToken: string | null) => setToken(newToken), []);

  useEffect(() => {
    getAuthToken();
    const clearSession = () => {
      queryClient.clear();
      setToken(null);
      setLoggedUser(null);
    };
    window.addEventListener(SESSION_INVALIDATED_EVENT, clearSession);
    window.addEventListener('storage', handleAuthStorageEvent);
    return () => {
      window.removeEventListener(SESSION_INVALIDATED_EVENT, clearSession);
      window.removeEventListener('storage', handleAuthStorageEvent);
    };
  }, [queryClient]);

  const contextValue: IAppContext = { loggedUser, updateLoggedUser, token, updateToken };
  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export default AppProvider;
