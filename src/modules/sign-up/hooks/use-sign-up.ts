import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { PublicHttp } from '@/config';
import { useAuth, useShowError, useShowSuccess } from '@/hooks';
import type { SignUpValues, SignUpResponse } from '../sign-up.interface';

export function useSignUp() {
  const { onLogin } = useAuth();
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();
  const navigate = useNavigate();

  const { mutate: signUp, isPending } = useMutation({
    mutationFn: (values: Omit<SignUpValues, 'confirmPassword'>) =>
      PublicHttp.post<SignUpResponse>('/users/sign-up', values).then((r) => r.data),
    onSuccess: (data) => {
      onLogin({ token: data.token, user: data.user as Parameters<typeof onLogin>[0]['user'] });
      showSuccess({ title: '¡Bienvenido!', description: 'Tu cuenta ha sido creada exitosamente.' });
      navigate('/');
    },
    onError: (error) => {
      showError(error as Parameters<typeof showError>[0]);
    },
  });

  const handleSubmit = (values: SignUpValues) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword: _confirmPassword, ...rest } = values;
    signUp(rest);
  };

  return { signUp: handleSubmit, isPending };
}
