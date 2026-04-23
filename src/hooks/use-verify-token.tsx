import { useEffect, useState } from 'react';
import { Http } from '@/config/http';
import useLoggedUser from './use-logged-user';
import type { IUser } from '@/interfaces';

interface UserData {
  user: IUser;
}

export function useVerifyToken() {
  const [isVerifyingToken, setIsVerifyingToken] = useState(true);
  const { updateLoggedUser, updateToken } = useLoggedUser();

  const getMe = (token: string) =>
    Http.get('/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(({ data }) => data);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe(token)
        .then(({ user }: UserData) => {
          if (user) {
            updateLoggedUser(user);
            updateToken(token);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          updateToken(null);
        })
        .finally(() => {
          setIsVerifyingToken(false);
        });
    } else {
      Promise.resolve().then(() => setIsVerifyingToken(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isVerifyingToken, setIsVerifyingToken };
}
