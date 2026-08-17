import { useMutation } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { useShowError, useShowSuccess, useInvalidateOldReports } from '@/hooks';
import type { AxiosResponseError } from '@/config/http';

export function useDeleteOldReport() {
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();
  const invalidateOldReports = useInvalidateOldReports();

  const { mutate: deleteOldReport, isPending: isDeleting } = useMutation({
    mutationFn: async (reportId: string) => {
      const { data } = await Http.delete(`/reports/old-pdf/${reportId}`);
      return data;
    },
    onSuccess: () => {
      showSuccess({
        title: 'Reporte eliminado',
        description: 'El reporte antiguo se ha eliminado correctamente.',
      });
      invalidateOldReports();
    },
    onError: (error: AxiosResponseError) => showError(error),
  });

  return { deleteOldReport, isDeleting };
}
