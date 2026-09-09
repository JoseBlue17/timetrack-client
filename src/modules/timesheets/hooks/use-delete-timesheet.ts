import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { TIMESHEETS_QUERY_KEY } from '@/query-keys';
import { useShowError, useShowSuccess } from '@/hooks';
import type { AxiosResponseError } from '@/config/http';

export function useDeleteTimesheet() {
  const queryClient = useQueryClient();
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();

  const { mutate, mutateAsync, isPending } = useMutation<unknown, AxiosResponseError, string>({
    mutationFn: (id: string) => Http.delete(`/timesheets/${id}`).then((r) => r.data),
    onSuccess: () => {
      showSuccess({
        title: 'Registro eliminado',
        description: 'El timesheet fue eliminado correctamente.',
      });
      queryClient.invalidateQueries({ queryKey: TIMESHEETS_QUERY_KEY });
    },
    onError: (error: AxiosResponseError) => showError(error),
  });

  return {
    deleteTimesheet: mutate,
    deleteTimesheetAsync: mutateAsync,
    isDeletingTimesheet: isPending,
  };
}
