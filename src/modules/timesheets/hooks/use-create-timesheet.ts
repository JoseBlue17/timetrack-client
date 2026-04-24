import { useMutation } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { useShowError, useShowSuccess } from '@/hooks';
import type { AxiosResponseError } from '@/config/http';
import type { ICreateTimesheetValues, ITimesheet } from '../components/timesheet.interface';
import { useGetTimesheets } from './use-get-timesheets';

export function useCreateTimesheet() {
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();
  const { invalidateTimesheets } = useGetTimesheets();

  return useMutation({
    mutationFn: (values: ICreateTimesheetValues) =>
      Http.post<ITimesheet>('/timesheets', values).then((r) => r.data),
    onSuccess: () => {
      showSuccess({
        title: 'Registro creado',
        description: 'El timesheet fue guardado correctamente.',
      });
      invalidateTimesheets();
    },
    onError: (error: AxiosResponseError) => showError(error),
  });
}
