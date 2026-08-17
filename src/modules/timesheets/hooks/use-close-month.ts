import { useCallback } from 'react';
import type { AxiosResponseError } from '@/config/http';
import { useCreateReport } from '@/modules/reports/hooks/use-create-report';
import { useShowError } from '@/hooks';
import { dataUrlToFile } from '@/tools';

interface IUseCloseMonthParams {
  month: number;
  year: number;
  hourlyRate: number;
  supervisorId?: string | null;
  signatureDataUrl: string | null;
}

export function useCloseMonth({
  month,
  year,
  hourlyRate,
  supervisorId,
  signatureDataUrl,
}: IUseCloseMonthParams) {
  const { createReport, isCreatingReport } = useCreateReport();
  const { showError } = useShowError();

  const closeMonth = useCallback(async () => {
    if (!signatureDataUrl) return;

    try {
      const signatureFile = dataUrlToFile(signatureDataUrl, 'signature.png');
      createReport({
        month,
        year,
        hourlyRate,
        supervisorId: supervisorId ?? undefined,
        signatureFile,
      });
    } catch (error) {
      showError(error as AxiosResponseError);
    }
  }, [signatureDataUrl, month, year, hourlyRate, supervisorId, createReport, showError]);

  return { closeMonth, isClosingMonth: isCreatingReport };
}
