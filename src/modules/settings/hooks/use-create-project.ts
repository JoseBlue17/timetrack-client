import { useMutation } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { useShowError, useShowSuccess } from '@/hooks';
import type { AxiosResponseError } from '@/config/http';
import type { ICreateProjectValues, IProject } from '../project.interface';
import { useGetProjects } from './use-get-projects';

export function useCreateProject() {
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();
  const { invalidateProjects } = useGetProjects();

  return useMutation({
    mutationFn: (values: ICreateProjectValues) =>
      Http.post<IProject>('/projects', values).then((r) => r.data),
    onSuccess: () => {
      showSuccess({
        title: 'Proyecto creado',
        description: 'El proyecto fue creado correctamente.',
      });
      invalidateProjects();
    },
    onError: (error: AxiosResponseError) => showError(error),
  });
}
