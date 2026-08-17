import { useMutation } from '@tanstack/react-query';
import { Http } from '@/config/http';
import {
  useShowError,
  useShowSuccess,
  useInvalidateMonthlyReports,
  useInvalidateMonthlySummary,
} from '@/hooks';
import { triggerConfetti } from '@/helpers/confetti';
import type { AxiosResponseError } from '@/config/http';

interface ICreateReportPayload {
  month: number;
  year: number;
  supervisorId?: string;
  hourlyRate: number;
}

export function useCreateReport() {
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();
  const invalidateMonthlyReports = useInvalidateMonthlyReports();
  const invalidateMonthlySummary = useInvalidateMonthlySummary();

  const { mutate: createReport, isPending: isCreatingReport } = useMutation({
    mutationFn: (payload: ICreateReportPayload) => {
      const { month, year, supervisorId, hourlyRate } = payload;

      return Http.post('/timesheets/close-month', {
        month,
        year,
        supervisorId,
        hourlyRate,
      }).then(({ data }) => data);
    },
    onSuccess: () => {
      showSuccess({
        title: 'Mes cerrado',
        description: 'El mes ha sido cerrado y el reporte generado exitosamente.',
      });
      triggerConfetti();
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
