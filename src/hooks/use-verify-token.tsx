import { useEffect, useState } from 'react';
import { Http } from '@/config/http';
import useLoggedUser from './use-logged-user';
import type { IUserMeResponse } from '@/interfaces';

const getMe = () => Http.get('/users/me').then(({ data }) => data);

export function useVerifyToken() {
  const [isVerifyingToken, setIsVerifyingToken] = useState(true);
  const { updateLoggedUser, updateToken } = useLoggedUser();

  useEffect(() => {
    getMe()
      .then(({ user }: IUserMeResponse) => {
        if (user) {
          updateLoggedUser(user);
          updateToken('present'); // El token real vive en la cookie HttpOnly.
        }
      })
      .catch(() => {
        updateToken(null);
      })
      .finally(() => {
        setIsVerifyingToken(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isVerifyingToken, setIsVerifyingToken };
}
