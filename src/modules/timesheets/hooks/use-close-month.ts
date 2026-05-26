import { useCallback } from 'react';
import type { AxiosResponseError } from '@/config/http';
import { useCreateReport } from '@/modules/reports/hooks/use-create-report';
import { useShowError } from '@/hooks';
import { dataUrlToFile } from '@/tools';
import type { IMonthlySummaryTimesheet } from '@/modules/reports/components/reports.interface';

interface IUseCloseMonthParams {
  month: number;
  year: number;
  signatureDataUrl: string | null;
  timesheets: IMonthlySummaryTimesheet[] | undefined;
}

export function useCloseMonth({ month, year, signatureDataUrl }: IUseCloseMonthParams) {
  const { createReport, isCreatingReport } = useCreateReport();
  const { showError } = useShowError();

  const closeMonth = useCallback(async () => {
    if (!signatureDataUrl) return;

    try {
      const signatureFile = dataUrlToFile(signatureDataUrl, 'signature.png');
      createReport({ month, year, signatureFile });
    } catch (error) {
      showError(error as AxiosResponseError);
    }
  }, [signatureDataUrl, month, year, createReport, showError]);

  return { closeMonth, isClosingMonth: isCreatingReport };
}
