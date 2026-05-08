import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { useShowError, useShowSuccess } from '@/hooks';
import type { AxiosResponseError } from '@/config/http';
import useLoggedUser from '@/hooks/use-logged-user';

export function useSignReport() {
  const queryClient = useQueryClient();
  const { loggedUser } = useLoggedUser();
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();

  const { mutate: signReport, isPending: isSigningReport } = useMutation({
    mutationFn: (reportId: string) =>
      Http.post(`/reports/${reportId}/sign-employee`, {
        userId: loggedUser?.id,
      }).then(({ data }) => data),
    onSuccess: () => {
      showSuccess({
        title: 'Reporte firmado',
        description: 'Has firmado el reporte correctamente.',
      });
      queryClient.invalidateQueries({ queryKey: ['REPORTS_LIST'] });
    },
    onError: (error: AxiosResponseError) => showError(error),
  });

  return {
    signReport,
    isSigningReport,
  };
}
