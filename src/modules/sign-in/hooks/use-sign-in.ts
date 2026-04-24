import { useMutation } from '@tanstack/react-query';
import { useAuth, useShowError, useShowSuccess } from '@/hooks';
import type { AxiosResponseError } from '@/config/http';
import { PublicHttp } from '@/config/http';
import type { SignInValues, SignInResponse } from '../components/sign-in.interface';

export function useSignIn() {
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();
  const { onLogin } = useAuth();

  const { mutate: signIn, isPending } = useMutation({
    mutationKey: ['SIGN_IN'],
    mutationFn: (values: Omit<SignInValues, 'rememberMe'>) =>
      PublicHttp.post<SignInResponse>('/users/sign-in', values).then(({ data }) => data),
    onSuccess: ({ token, user }) => {
      onLogin({ token, user: user as import('@/interfaces').IUser });
      showSuccess({ title: 'Bienvenido', description: `Hola, ${user.profile.firstName}!` });
    },
    onError: (error: AxiosResponseError) => showError(error),
  });

  return { signIn, isPending };
}
