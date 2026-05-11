import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Http } from '@/config/http';
import type { IReportPdfResponse } from '../components/reports.interface';

export function useGetReportPdf(reportId: string | null) {
  const queryClient = useQueryClient();

  const { data, ...rest } = useQuery<IReportPdfResponse>({
    queryKey: ['REPORT_PDF', reportId],
    queryFn: () => Http.get(`/reports/${reportId}/pdf`).then(({ data }) => data),
    enabled: !!reportId,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['REPORT_PDF', reportId] });
  };

  return {
    pdfUrl: data?.pdfUrl,
    ...rest,
    invalidate,
  };
}
