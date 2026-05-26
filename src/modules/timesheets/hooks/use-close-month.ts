import { useCallback } from 'react';
import { Http } from '@/config/http';
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

export function useCloseMonth({ month, year, signatureDataUrl, timesheets }: IUseCloseMonthParams) {
  const { createReport, isCreatingReport } = useCreateReport();
  const { showError } = useShowError();

  const closeMonth = useCallback(async () => {
    if (!signatureDataUrl) return;

    try {
      const signatureFile = dataUrlToFile(signatureDataUrl, 'signature.png');

      if (timesheets?.length) {
        await Promise.all(
          timesheets
            .filter((t) => Boolean(t.id))
            .map((t) => {
              const formData = new FormData();
              formData.append('file', signatureFile);
              return Http.post(`/timesheets/${t.id}/sign`, formData);
            }),
        );
      }

      createReport({ month, year });
    } catch (error) {
      showError(error as AxiosResponseError);
    }
  }, [signatureDataUrl, timesheets, month, year, createReport, showError]);

  return { closeMonth, isClosingMonth: isCreatingReport };
}
