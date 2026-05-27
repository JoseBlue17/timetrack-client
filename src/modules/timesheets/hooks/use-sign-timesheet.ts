import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { useShowError, useShowSuccess } from '@/hooks';
import type { AxiosResponseError } from '@/config/http';

interface ISignTimesheetPayload {
  timesheetId: string;
  file: File;
}

export function useSignTimesheet() {
  const queryClient = useQueryClient();
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();

  const { mutate: signTimesheet, isPending: isSigningTimesheet } = useMutation({
    mutationFn: async ({ timesheetId, file }: ISignTimesheetPayload) => {
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
      queryClient.invalidateQueries({ queryKey: ['TIMESHEETS'] });
    },
    onError: (error: AxiosResponseError) => showError(error),
  });

  return { signTimesheet, isSigningTimesheet };
}
