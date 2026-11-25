import { useQuery } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { requireDocumentUrl } from '@/helpers/document-url';
import type { IReportPdfResponse } from '../reports.interface';
import { useInvalidateReportPdf } from '@/hooks';
import { REPORT_PDF_QUERY_KEY } from '@/query-keys';

export function useGetReportPdf(reportId: string | null) {
  const { data, ...rest } = useQuery<IReportPdfResponse>({
    queryKey: [...REPORT_PDF_QUERY_KEY, reportId],
    queryFn: () =>
      Http.get<IReportPdfResponse>(`/reports/${reportId}/pdf`).then(({ data }) => ({
        ...data,
        url: requireDocumentUrl(data.url),
      })),
    enabled: !!reportId,
  });

  const invalidate = useInvalidateReportPdf();

  return {
    reportPdfUrl: data?.url,
    ...rest,
    invalidate,
  };
}
