import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { TIMESHEETS_QUERY_KEY } from '@/query-keys';
import { useShowError, useShowSuccess } from '@/hooks';
import type { AxiosResponseError } from '@/config/http';
import type { ICreateTimesheetValues, ITimesheet } from '../timesheet.interface';

export function useCreateTimesheet() {
  const queryClient = useQueryClient();
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();

  const { mutate, mutateAsync, isPending } = useMutation<
    ITimesheet,
    AxiosResponseError,
    ICreateTimesheetValues
  >({
    mutationFn: (values: ICreateTimesheetValues) =>
      Http.post<ITimesheet>('/timesheets', values).then(({ data }) => data),
    onSuccess: () => {
      showSuccess({
        title: 'Registro creado',
        description: 'El timesheet fue guardado correctamente.',
      });
      queryClient.invalidateQueries({ queryKey: TIMESHEETS_QUERY_KEY });
    },
    onError: (error: AxiosResponseError) => showError(error),
  });

  return {
    createTimesheet: mutate,
    createTimesheetAsync: mutateAsync,
    isCreatingTimesheet: isPending,
  };
}
