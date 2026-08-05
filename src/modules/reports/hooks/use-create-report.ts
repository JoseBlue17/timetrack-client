import { useMutation } from '@tanstack/react-query';
import { Http } from '@/config/http';
import {
  useShowError,
  useShowSuccess,
  useInvalidateMonthlyReports,
  useInvalidateMonthlySummary,
} from '@/hooks';
import type { AxiosResponseError } from '@/config/http';

interface ICreateReportPayload {
  month: number;
  year: number;
  signatureFile?: File;
}

export function useCreateReport() {
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();
  const invalidateMonthlyReports = useInvalidateMonthlyReports();
  const invalidateMonthlySummary = useInvalidateMonthlySummary();

  const { mutate: createReport, isPending: isCreatingReport } = useMutation({
    mutationFn: (payload: ICreateReportPayload) => {
      if (payload.signatureFile) {
        const formData = new FormData();
        formData.append('month', String(payload.month));
        formData.append('year', String(payload.year));
        formData.append('file', payload.signatureFile);
        return Http.post('/timesheets/close-month', formData).then(({ data }) => data);
      }
      return Http.post('/timesheets/close-month', {
        month: payload.month,
        year: payload.year,
      }).then(({ data }) => data);
    },
    onSuccess: () => {
      showSuccess({
        title: 'Mes cerrado',
        description: 'El mes ha sido cerrado y el reporte generado exitosamente.',
      });
      invalidateMonthlySummary();
      invalidateMonthlyReports();
    },
    onError: (error: AxiosResponseError) => showError(error),
  });

  return {
    createReport,
    isCreatingReport,
  };
}
