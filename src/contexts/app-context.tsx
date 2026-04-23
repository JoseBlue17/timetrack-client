import { createContext } from 'react';
import type { IAppContext } from '@/interfaces';

const initialContext: IAppContext = {
  loggedUser: null,
  token: null,
  updateLoggedUser: () => {},
  updateToken: () => {},
};

const AppContext = createContext<IAppContext>(initialContext);

export default AppContext;
