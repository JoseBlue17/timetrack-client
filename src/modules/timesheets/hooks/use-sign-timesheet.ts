import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { useShowError, useShowSuccess } from '@/hooks';
import type { AxiosResponseError } from '@/config/http';

export function useSignTimesheet(timesheetId: string) {
  const queryClient = useQueryClient();
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();

  const { mutate: signTimesheet, isPending: isSigningTimesheet } = useMutation({
    mutationKey: ['SIGN_TIMESHEET', timesheetId],
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return Http.post(`/timesheets/${timesheetId}/sign`, formData).then(({ data }) => data);
    },
    onSuccess: () => {
      showSuccess({
        title: 'Firma subida',
        description: 'La firma se registró correctamente.',
      });
      queryClient.invalidateQueries({ queryKey: ['TIMESHEETS'] });
    },
    onError: (error: AxiosResponseError) => {
      showError(error);
    },
  });

  return { signTimesheet, isSigningTimesheet };
}
