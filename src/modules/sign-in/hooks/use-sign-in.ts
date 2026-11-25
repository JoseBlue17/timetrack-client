import { useMutation } from '@tanstack/react-query';
import { useAuth, useShowError, useShowSuccess } from '@/hooks';
import type { AxiosResponseError } from '@/config/http';
import { PublicHttp } from '@/config/http';
import { getSessionGeneration, invalidateSession, isCurrentSession } from '@/helpers/auth-session';
import type { IUser } from '@/interfaces';
import type { SignInValues, SignInResponse } from '../sign-in.interface';

export function useSignIn() {
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();
  const { onLogin } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationKey: ['SIGN_IN'],
    mutationFn: ({ values }: { values: SignInValues; generation: number }) => {
      const { email, password } = values;
      return PublicHttp.post<SignInResponse>('/users/sign-in', { email, password }).then(
        ({ data }) => data,
      );
    },
    onSuccess: ({ token, user }, { values, generation }) => {
      if (!isCurrentSession(generation) || !token?.trim()) return;
      if (!onLogin({ token, user: user as IUser }, values.rememberMe, generation)) return;
      showSuccess({ title: 'Bienvenido', description: `Hola, ${user.profile.firstName}!` });
    },
    onError: (error: AxiosResponseError, { generation }) => {
      if (isCurrentSession(generation)) showError(error);
    },
  });

  const signIn = (values: SignInValues) => {
    invalidateSession();
    mutate({ values, generation: getSessionGeneration() });
  };
  return { signIn, isPending };
}
