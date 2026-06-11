import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from 'antd';
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
    onError: (error: AxiosResponseError) => {
      const code = error.response?.data?.code;
      if (code === 'EMPLOYEE_WALLET_REQUIRED') {
        Modal.error({
          title: 'Wallet requerida',
          content:
            'No se puede aprobar este reporte porque el empleado no tiene una wallet registrada. El empleado debe ir a Configuración → Wallets y agregar una dirección de wallet predeterminada.',
        });
        return;
      }
      showError(error);
    },
  });

  return {
    approveReport,
    isApprovingReport,
  };
}
