import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { useShowError, useShowSuccess } from '@/hooks';
import type { AxiosResponseError } from '@/config/http';
import type { ICreateTimesheetValues, ITimesheet } from '../components/timesheet.interface';

export function useCreateTimesheet() {
  const queryClient = useQueryClient();
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();

  const mutation = useMutation<ITimesheet, AxiosResponseError, ICreateTimesheetValues>({
    mutationFn: (values: ICreateTimesheetValues) =>
      Http.post<ITimesheet>('/timesheets', values).then(({ data }) => data),
    onSuccess: () => {
      showSuccess({
        title: 'Registro creado',
        description: 'El timesheet fue guardado correctamente.',
      });
      queryClient.invalidateQueries({ queryKey: ['TIMESHEETS'] });
    },
    onError: (error: AxiosResponseError) => showError(error),
  });

  return {
    ...mutation,
    createTimesheet: mutation.mutate,
    isCreatingTimesheet: mutation.isPending,
  };
}
