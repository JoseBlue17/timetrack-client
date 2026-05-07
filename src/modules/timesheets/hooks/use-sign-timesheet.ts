import { useMutation } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { useShowError, useShowSuccess } from '@/hooks';
import type { AxiosResponseError } from '@/config/http';
import { useGetTimesheets } from './use-get-timesheets';

export function useSignTimesheet(timesheetId: string) {
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();
  const { invalidateTimesheets } = useGetTimesheets();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await Http.post(`/timesheets/${timesheetId}/sign`, formData);
      return data;
    },
    onSuccess: () => {
      showSuccess({
        title: 'Firma subida',
        description: 'La firma se registró correctamente.',
      });
      invalidateTimesheets();
    },
    onError: (error: AxiosResponseError) => showError(error),
  });
}
