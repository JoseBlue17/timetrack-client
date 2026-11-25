import { useMutation } from '@tanstack/react-query';
import { PublicHttp } from '@/config';
import { useAuth, useShowError, useShowSuccess } from '@/hooks';
import { getSessionGeneration, invalidateSession, isCurrentSession } from '@/helpers/auth-session';
import type { SignUpValues, SignUpResponse } from '../sign-up.interface';

export function useSignUp() {
  const { onLogin } = useAuth();
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      values,
    }: {
      values: Omit<SignUpValues, 'confirmPassword'>;
      generation: number;
    }) => PublicHttp.post<SignUpResponse>('/users/sign-up', values).then((r) => r.data),
    onSuccess: (data, { generation }) => {
      if (!isCurrentSession(generation)) return;
      if (
        !onLogin(
          { token: data.token, user: data.user as Parameters<typeof onLogin>[0]['user'] },
          true,
          generation,
        )
      )
        return;
      showSuccess({ title: '¡Bienvenido!', description: 'Tu cuenta ha sido creada exitosamente.' });
    },
    onError: (error, { generation }) => {
      if (isCurrentSession(generation)) showError(error as Parameters<typeof showError>[0]);
    },
  });

  const handleSubmit = (values: SignUpValues) => {
    const { firstName, lastName, email, password } = values;
    invalidateSession();
    mutate({
      values: { firstName, lastName, email, password },
      generation: getSessionGeneration(),
    });
  };

  return { signUp: handleSubmit, isPending };
}
