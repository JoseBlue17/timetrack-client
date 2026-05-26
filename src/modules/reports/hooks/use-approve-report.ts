import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { useShowError, useShowSuccess } from '@/hooks';
import type { AxiosResponseError } from '@/config/http';

export interface ApproveReportPayload {
  reportId: string;
  file?: File;
}

export function useApproveReport() {
  const queryClient = useQueryClient();
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();

  const { mutate: approveReport, isPending: isApprovingReport } = useMutation({
    mutationFn: async ({ reportId, file }: ApproveReportPayload) => {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      const { data } = await Http.post(`/reports/${reportId}/approve`, formData);
      return data;
    },
    onSuccess: () => {
      showSuccess({
        title: 'Reporte aprobado',
        description: 'El reporte ha sido aprobado correctamente.',
      });
      queryClient.invalidateQueries({ queryKey: ['REPORTS_LIST'] });
    },
    onError: (error: AxiosResponseError) => showError(error),
  });

  return {
    approveReport,
    isApprovingReport,
  };
}
