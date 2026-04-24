import { useMutation } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { useShowError, useShowSuccess } from '@/hooks';
import type { AxiosResponseError } from '@/config/http';
import type { IUpdateTimesheetValues, ITimesheet } from '../components/timesheet.interface';
import { useGetTimesheets } from './use-get-timesheets';

export function useUpdateTimesheet(timesheetId: string) {
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();
  const { invalidateTimesheets } = useGetTimesheets();

  return useMutation({
    mutationFn: (values: IUpdateTimesheetValues) =>
      Http.put<ITimesheet>(`/timesheets/${timesheetId}`, values).then((r) => r.data),
    onSuccess: () => {
      showSuccess({
        title: 'Registro actualizado',
        description: 'El timesheet fue actualizado correctamente.',
      });
      invalidateTimesheets();
    },
    onError: (error: AxiosResponseError) => showError(error),
  });
}
