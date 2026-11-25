import { useEffect, useState } from 'react';
import { Http } from '@/config/http';
import useLoggedUser from './use-logged-user';
import type { IUserMeResponse } from '@/interfaces';
import {
  getAuthToken,
  getSessionGeneration,
  invalidateSession,
  isCurrentSession,
} from '@/helpers/auth-session';

export function useVerifyToken() {
  const [isVerifyingToken, setIsVerifyingToken] = useState(true);
  const { updateLoggedUser, updateToken } = useLoggedUser();

  useEffect(() => {
    let active = true;
    const generation = getSessionGeneration();
    const token = getAuthToken();
    if (!token) {
      void Promise.resolve().then(() => {
        if (active) setIsVerifyingToken(false);
      });
      return () => {
        active = false;
      };
    }
    Http.get<IUserMeResponse>('/users/me')
      .then(({ data: { user } }) => {
        if (!active || !isCurrentSession(generation)) return;
        if (!user) {
          invalidateSession();
          return;
        }
        updateLoggedUser(user);
        updateToken(token);
      })
      .catch(() => {
        if (active && isCurrentSession(generation)) invalidateSession();
      })
      .finally(() => {
        if (active) setIsVerifyingToken(false);
      });
    return () => {
      active = false;
    };
  }, [updateLoggedUser, updateToken]);

  return { isVerifyingToken, setIsVerifyingToken };
}
