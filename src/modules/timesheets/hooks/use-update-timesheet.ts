import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { TIMESHEETS_QUERY_KEY } from '@/query-keys';
import { useShowError, useShowSuccess } from '@/hooks';
import type { AxiosResponseError } from '@/config/http';
import type { IUpdateTimesheetValues, ITimesheet } from '../components/timesheet.interface';

export function useUpdateTimesheet(timesheetId: string) {
  const queryClient = useQueryClient();
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();

  const { mutate, mutateAsync, isPending } = useMutation<
    ITimesheet,
    AxiosResponseError,
    IUpdateTimesheetValues
  >({
    mutationFn: (values: IUpdateTimesheetValues) =>
      Http.put<ITimesheet>(`/timesheets/${timesheetId}`, values).then((r) => r.data),
    onSuccess: () => {
      showSuccess({
        title: 'Registro actualizado',
        description: 'El timesheet fue actualizado correctamente.',
      });
      queryClient.invalidateQueries({ queryKey: TIMESHEETS_QUERY_KEY });
    },
    onError: (error: AxiosResponseError) => showError(error),
  });

  return {
    updateTimesheet: mutate,
    updateTimesheetAsync: mutateAsync,
    isUpdatingTimesheet: isPending,
  };
}
