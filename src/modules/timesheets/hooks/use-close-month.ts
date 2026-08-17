import { useCallback } from 'react';
import type { AxiosResponseError } from '@/config/http';
import { useCreateReport } from '@/modules/reports/hooks/use-create-report';
import { useShowError } from '@/hooks';

interface IUseCloseMonthParams {
  month: number;
  year: number;
  hourlyRate: number;
  supervisorId?: string | null;
  signatureUrl: string | null;
}

export function useCloseMonth({
  month,
  year,
  hourlyRate,
  supervisorId,
  signatureUrl,
}: IUseCloseMonthParams) {
  const { createReport, isCreatingReport } = useCreateReport();
  const { showError } = useShowError();

  const closeMonth = useCallback(async () => {
    if (!signatureUrl) return;

    try {
      createReport({
        month,
        year,
        hourlyRate,
        supervisorId: supervisorId ?? undefined,
      });
    } catch (error) {
      showError(error as AxiosResponseError);
    }
  }, [signatureUrl, month, year, hourlyRate, supervisorId, createReport, showError]);

  return { closeMonth, isClosingMonth: isCreatingReport };
}
