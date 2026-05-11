import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Http } from '@/config/http';
import type { IReportPdfResponse } from '../components/reports.interface';

export function useGetReportPdf(reportId: string | null) {
  const queryClient = useQueryClient();

  const { data, ...rest } = useQuery<IReportPdfResponse>({
    queryKey: ['report-pdf', reportId],
    queryFn: () => Http.get(`/reports/${reportId}/pdf`).then(({ data }) => data),
    enabled: !!reportId,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['report-pdf'] });
  };

  return {
    reportPdfUrl: data?.url,
    ...rest,
    invalidate,
  };
}
