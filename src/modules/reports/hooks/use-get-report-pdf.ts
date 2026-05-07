import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Http } from '@/config/http';

interface IReportPdfResponse {
  url: string;
}

export function useGetReportPdf(reportId: string | null) {
  const queryClient = useQueryClient();

  const getReportPdf = useCallback(async () => {
    if (!reportId) return null;
    const { data } = await Http.get<IReportPdfResponse>(`/reports/${reportId}/pdf`);
    return data.url;
  }, [reportId]);

  const { data: pdfUrl, ...rest } = useQuery({
    queryKey: ['REPORT_PDF', reportId],
    queryFn: getReportPdf,
    enabled: !!reportId,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['REPORT_PDF', reportId] });
  };

  return {
    pdfUrl,
    ...rest,
    invalidate,
  };
}
