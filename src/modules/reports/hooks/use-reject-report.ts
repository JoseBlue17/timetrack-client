import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { useShowError, useShowSuccess } from '@/hooks';
import type { AxiosResponseError } from '@/config/http';

export function useRejectReport() {
  const queryClient = useQueryClient();
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();

  const { mutate: rejectReport, isPending: isRejectingReport } = useMutation({
    mutationFn: (reportId: string) =>
      Http.post(`/reports/${reportId}/reject`).then(({ data }) => data),
    onSuccess: () => {
      showSuccess({
        title: 'Reporte rechazado',
        description: 'El reporte ha sido devuelto para corrección.',
      });
      queryClient.invalidateQueries({ queryKey: ['REPORTS_LIST'] });
    },
    onError: (error: AxiosResponseError) => showError(error),
  });

  return {
    rejectReport,
    isRejectingReport,
  };
}
