import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutateOptions } from '@tanstack/react-query';
import { getSessionGeneration, isCurrentSession } from '@/helpers/auth-session';
import { Http } from '@/config/http';
import { useShowError, useShowSuccess } from '@/hooks';
import useLoggedUser from './use-logged-user';
import type { AxiosResponseError } from '@/config/http';
import { USER_PROFILE_QUERY_KEY } from '@/query-keys';
import type { IUser } from '@/interfaces';

export interface IUpdateProfilePayload {
  firstName: string;
  lastName: string;
  email?: string;
  position?: string;
  hourlyRate?: number;
  signatureImageUrl?: string | null;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();
  const { updateLoggedUser } = useLoggedUser();

  const {
    mutate,
    mutateAsync,
    isPending: isUpdatingProfile,
  } = useMutation({
    mutationFn: ({ generation, ...payload }: IUpdateProfilePayload & { generation: number }) => {
      return Http.patch<{ user: IUser }>('/users/me', payload, {
        expectedSessionGeneration: generation,
      }).then(({ data }) => data);
    },
    onSuccess: ({ user }: { user: IUser }, { generation }) => {
      if (!isCurrentSession(generation)) return;
      showSuccess({
        title: 'Perfil actualizado',
        description: 'Tu información personal ha sido actualizada correctamente.',
      });
      updateLoggedUser(user);
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
    },
    onError: (error: AxiosResponseError, { generation }) => {
      if (isCurrentSession(generation)) showError(error);
    },
  });

  const updateProfile = (
    payload: IUpdateProfilePayload,
    options?: MutateOptions<{ user: IUser }, AxiosResponseError, IUpdateProfilePayload>,
  ) => mutate({ ...payload, generation: getSessionGeneration() }, options);

  const updateProfileAsync = (payload: IUpdateProfilePayload) =>
    mutateAsync({ ...payload, generation: getSessionGeneration() });

  return { updateProfile, updateProfileAsync, isUpdatingProfile };
}
