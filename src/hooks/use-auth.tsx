import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import type { IOnLogin } from '@/interfaces';
import useLoggedUser from './use-logged-user';
import { useInvalidateUserProfile } from './use-invalidate-queries';
import {
  getSessionGeneration,
  invalidateSession,
  isCurrentSession,
  storeAuthToken,
} from '@/helpers/auth-session';

export function useAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { updateLoggedUser, updateToken } = useLoggedUser();
  const invalidateUserProfile = useInvalidateUserProfile();
  const generation = getSessionGeneration();

  const onLogin = (
    { token, user }: IOnLogin,
    rememberMe = true,
    expectedGeneration = generation,
  ) => {
    if (!isCurrentSession(expectedGeneration) || !token?.trim() || !user) return false;
    storeAuthToken(token, rememberMe);
    queryClient.clear();
    updateToken(token);
    updateLoggedUser(user);
    invalidateUserProfile();
    navigate('/');
    return true;
  };

  const onLogout = async () => {
    invalidateSession();
    queryClient.clear();
    updateToken(null);
    updateLoggedUser(null);
    navigate('/sign-in');
  };

  return { onLogin, onLogout };
}
