import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import type { IOnLogin } from '@/interfaces';
import useLoggedUser from './use-logged-user';
import { useInvalidateUserProfile } from './use-invalidate-queries';

export function useAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { updateLoggedUser, updateToken } = useLoggedUser();
  const invalidateUserProfile = useInvalidateUserProfile();

  const onLogin = ({ token, user }: IOnLogin) => {
    localStorage.setItem('token', token);
    updateToken(token);
    updateLoggedUser(user);
    invalidateUserProfile();
    navigate('/');
  };

  const onLogout = async () => {
    localStorage.removeItem('token');
    queryClient.clear();
    updateToken(null);
    updateLoggedUser(null);
    navigate('/sign-in');
  };

  return { onLogin, onLogout };
}
