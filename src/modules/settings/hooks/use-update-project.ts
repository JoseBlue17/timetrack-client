import { useMutation } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { useShowError, useShowSuccess } from '@/hooks';
import type { AxiosResponseError } from '@/config/http';
import type { IUpdateProjectValues, IProject } from '../project.interface';
import { useGetProjects } from './use-get-projects';

export function useUpdateProject(projectId: string) {
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();
  const { invalidateProjects } = useGetProjects();

  return useMutation({
    mutationFn: (values: IUpdateProjectValues) =>
      Http.put<IProject>(`/projects/${projectId}`, values).then((r) => r.data),
    onSuccess: () => {
      showSuccess({
        title: 'Proyecto actualizado',
        description: 'El proyecto fue actualizado correctamente.',
      });
      invalidateProjects();
    },
    onError: (error: AxiosResponseError) => showError(error),
  });
}
