import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { useShowError, useShowSuccess } from '@/hooks';
import useLoggedUser from './use-logged-user';
import type { AxiosResponseError } from '@/config/http';
import { USER_PROFILE_QUERY_KEY } from './use-get-profile';
import type { IUser } from '@/interfaces';

export interface IUpdateProfilePayload {
  firstName: string;
  lastName: string;
  email?: string;
  position?: string;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();
  const { updateLoggedUser } = useLoggedUser();

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: (payload: IUpdateProfilePayload) =>
      Http.patch('/users/me', payload).then(({ data }) => data),
    onSuccess: ({ user }: { user: IUser }) => {
      showSuccess({
        title: 'Perfil actualizado',
        description: 'Tu información personal ha sido actualizada correctamente.',
      });
      updateLoggedUser(user);
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
    },
    onError: (error: AxiosResponseError) => showError(error),
  });

  return { updateProfile, isUpdatingProfile };
}
