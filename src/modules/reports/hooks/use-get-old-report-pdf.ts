import { useQuery } from '@tanstack/react-query';
import { Http } from '@/config/http';

export function useGetOldReportPdf(reportId: string | null) {
  return useQuery({
    queryKey: ['old-report-pdf', reportId],
    queryFn: () =>
      Http.get<{ url: string }>(`/reports/old-pdf/${reportId}/pdf`).then(({ data }) => data.url),
    enabled: !!reportId,
  });
}
