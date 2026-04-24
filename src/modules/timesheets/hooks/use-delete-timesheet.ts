import { useMutation } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { useShowError, useShowSuccess } from '@/hooks';
import type { AxiosResponseError } from '@/config/http';
import { useGetTimesheets } from './use-get-timesheets';

export function useDeleteTimesheet() {
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();
  const { invalidateTimesheets } = useGetTimesheets();

  return useMutation({
    mutationFn: (id: string) => Http.delete(`/timesheets/${id}`).then((r) => r.data),
    onSuccess: () => {
      showSuccess({
        title: 'Registro eliminado',
        description: 'El timesheet fue eliminado correctamente.',
      });
      invalidateTimesheets();
    },
    onError: (error: AxiosResponseError) => showError(error),
  });
}
