import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import type { IOnLogin } from '@/interfaces';
import useLoggedUser from './use-logged-user';

export function useAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { updateLoggedUser, updateToken } = useLoggedUser();

  const onLogin = ({ token, user }: IOnLogin) => {
    localStorage.setItem('token', token);
    updateToken(token);
    updateLoggedUser(user);
    queryClient.invalidateQueries({ queryKey: ['USER_PROFILE'] });
    navigate('/');
  };

  const onLogout = () => {
    localStorage.removeItem('token');
    updateToken(null);
    updateLoggedUser(null);
    navigate('/sign-in');
  };

  return { onLogin, onLogout };
}
