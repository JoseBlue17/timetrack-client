import { useQuery } from '@tanstack/react-query';
import { Http } from '@/config/http';
import type { IReportPdfResponse } from '../components/reports.interface';
import { useInvalidateReportPdf } from '@/hooks';
import { REPORT_PDF_QUERY_KEY } from '@/query-keys';

export function useGetReportPdf(reportId: string | null) {
  const { data, ...rest } = useQuery<IReportPdfResponse>({
    queryKey: [...REPORT_PDF_QUERY_KEY, reportId],
    queryFn: () => Http.get(`/reports/${reportId}/pdf`).then(({ data }) => data),
    enabled: !!reportId,
  });

  const invalidate = useInvalidateReportPdf();

  return {
    reportPdfUrl: data?.url,
    ...rest,
    invalidate,
  };
}
