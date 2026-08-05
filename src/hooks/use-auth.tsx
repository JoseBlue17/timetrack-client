import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import type { IOnLogin } from '@/interfaces';
import { PublicHttp } from '@/config/http';
import useLoggedUser from './use-logged-user';
import { useInvalidateUserProfile } from './use-invalidate-queries';

export function useAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { updateLoggedUser, updateToken } = useLoggedUser();
  const invalidateUserProfile = useInvalidateUserProfile();

  const onLogin = ({ token, user }: IOnLogin) => {
    // El token se almacena en una cookie HttpOnly gestionada por el backend.
    updateToken(token);
    updateLoggedUser(user);
    invalidateUserProfile();
    navigate('/');
  };

  const onLogout = async () => {
    try {
      // El backend debe borrar la cookie HttpOnly; el frontend no puede hacerlo directamente.
      await PublicHttp.post('/users/sign-out');
    } catch {
      // Si el endpoint falla, igual limpiamos el estado local para no dejar la sesión abierta en la UI.
    }

    queryClient.clear();
    updateToken(null);
    updateLoggedUser(null);
    navigate('/sign-in');
  };

  return { onLogin, onLogout };
}
