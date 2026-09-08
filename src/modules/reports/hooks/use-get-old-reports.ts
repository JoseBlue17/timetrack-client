import { useInfiniteQuery } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { OLD_REPORTS_QUERY_KEY } from '@/query-keys';
import { useInvalidateOldReports } from '@/hooks';

interface IOldReportFromApi {
  id: string;
  pdfFileName: string;
  referenceMonth: number;
  referenceYear: number;
  pdfPath: string;
  uploadedBy: string;
  createdAt: string;
}

export interface IOldReport {
  id: string;
  pdfFileName: string;
  referenceMonth: number;
  referenceYear: number;
  referenceMonthLabel: string;
  uploadedAtDate: string;
  pdfPath: string;
}

interface IOldReportsResponse {
  data: IOldReportFromApi[];
  nextCursor: string | null;
}

const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

function mapToOldReport(raw: IOldReportFromApi): IOldReport {
  return {
    id: raw.id,
    pdfFileName: raw.pdfFileName,
    referenceMonth: raw.referenceMonth,
    referenceYear: raw.referenceYear,
    referenceMonthLabel: `${MONTH_NAMES[raw.referenceMonth - 1]} ${raw.referenceYear}`,
    uploadedAtDate: new Date(raw.createdAt).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    pdfPath: raw.pdfPath,
  };
}

export function useGetOldReports() {
  const { data: oldReports = [], ...rest } = useInfiniteQuery<
    IOldReportsResponse,
    Error,
    IOldReport[],
    typeof OLD_REPORTS_QUERY_KEY,
    string | undefined
  >({
    queryKey: OLD_REPORTS_QUERY_KEY,
    queryFn: ({ pageParam }) =>
      Http.get<IOldReportsResponse>('/reports/old-pdf', {
        params: pageParam ? { cursor: pageParam } : undefined,
      }).then(({ data }) => data),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    select: (data) => data.pages.flatMap((page) => page.data.map(mapToOldReport)),
  });

  const invalidateOldReports = useInvalidateOldReports();

  return { ...rest, oldReports, invalidateOldReports };
}
