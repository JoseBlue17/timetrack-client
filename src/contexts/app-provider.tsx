import { useState } from 'react';
import type { ReactNode } from 'react';
import AppContext from '@/contexts/app-context';
import type { IUser, IAppContext } from '@/interfaces';

type IProvider = { children: ReactNode };

export const AppProvider = ({ children }: IProvider) => {
  const [loggedUser, setLoggedUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const updateLoggedUser = (user: IUser | null) => setLoggedUser(user);
  const updateToken = (newToken: string | null) => setToken(newToken);

  const contextValue: IAppContext = { loggedUser, updateLoggedUser, token, updateToken };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export default AppProvider;
