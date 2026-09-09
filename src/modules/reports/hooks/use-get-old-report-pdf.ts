import { useQuery } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { OLD_REPORT_PDF_QUERY_KEY } from '@/query-keys';

export function useGetOldReportPdf(reportId: string | null) {
  return useQuery({
    queryKey: [...OLD_REPORT_PDF_QUERY_KEY, reportId],
    queryFn: () =>
      Http.get<{ url: string }>(`/reports/old-pdf/${reportId}/pdf`).then(({ data }) => data.url),
    enabled: !!reportId,
  });
}
