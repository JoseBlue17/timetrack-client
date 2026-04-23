import { useContext } from 'react';
import AppContext from '@/contexts/app-context';
import type { IAppContext } from '@/interfaces';

const useLoggedUser = (): IAppContext => {
  const { loggedUser, token, updateLoggedUser, updateToken } = useContext(AppContext);
  return { loggedUser, token, updateLoggedUser, updateToken };
};

export default useLoggedUser;
