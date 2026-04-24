import { useMutation } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { useShowError, useShowSuccess } from '@/hooks';
import type { AxiosResponseError } from '@/config/http';
import { useGetProjects } from './use-get-projects';

export function useDeleteProject() {
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();
  const { invalidateProjects } = useGetProjects();

  return useMutation({
    mutationFn: (id: string) => Http.delete(`/projects/${id}`).then((r) => r.data),
    onSuccess: () => {
      showSuccess({
        title: 'Proyecto eliminado',
        description: 'El proyecto fue eliminado correctamente.',
      });
      invalidateProjects();
    },
    onError: (error: AxiosResponseError) => showError(error),
  });
}
