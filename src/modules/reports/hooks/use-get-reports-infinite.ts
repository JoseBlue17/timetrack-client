import { useInfiniteQuery } from '@tanstack/react-query';

import { Http } from '@/config/http';
import { useInvalidateMonthlyReports } from '@/hooks';
import { REPORTS_LIST_QUERY_KEY } from '@/query-keys';

import { ReportStatus } from '@/enums';
import type {
  BackendMonthlyReport,
  IReportsPaginatedResponse,
  IMonthlyReport,
} from '../components/reports.interface';

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

const BACKEND_TO_ENUM: Record<string, ReportStatus> = {
  draft: ReportStatus.Draft,
  submitted: ReportStatus.Submitted,
  signed_by_employee: ReportStatus.SignedByEmployee,
  approved: ReportStatus.Approved,
  rejected: ReportStatus.Rejected,
  paid: ReportStatus.Paid,
  closed: ReportStatus.Closed,
};

function mapToMonthlyReport(backend: BackendMonthlyReport): IMonthlyReport {
  const firstName = backend.firstName ?? '';
  const lastName = backend.lastName ?? '';
  const fullName = `${firstName} ${lastName}`.trim();

  return {
    id: backend.id || backend._id || '',
    userId: backend.userId || '',
    monthName: `${MONTH_NAMES[backend.month - 1]} ${backend.year}`,
    month: backend.month,
    year: backend.year,
    totalWorkedHours: backend.totalHours || 0,
    totalAmountInUsdt: backend.totalAmount || 0,
    reportStatus: BACKEND_TO_ENUM[backend.status ?? ''] ?? ReportStatus.Draft,
    isSigned: backend.employeeSigned || false,
    userName: fullName || undefined,
    supervisorName: backend.supervisorName || undefined,
    paymentId: backend.paymentId ?? null,
  };
}

async function getReportsPage(cursor?: string): Promise<{
  reports: IMonthlyReport[];
  nextCursor: string | null;
}> {
  const params: Record<string, string> = {};
  if (cursor) {
    params.cursor = cursor;
  }

  const { data } = await Http.get<IReportsPaginatedResponse>('/reports', {
    params: Object.keys(params).length > 0 ? params : undefined,
  });

  return {
    reports: data.data.map(mapToMonthlyReport),
    nextCursor: data.nextCursor ?? null,
  };
}

export function useGetReportsInfinite() {
  const {
    data,
    error,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: [...REPORTS_LIST_QUERY_KEY, 'infinite'],
    queryFn: async ({ pageParam }) => {
      const cursor = typeof pageParam === 'string' ? pageParam : undefined;
      return getReportsPage(cursor);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 30_000,
  });

  const invalidateReports = useInvalidateMonthlyReports();

  const reports = data?.pages.flatMap((page) => page.reports) ?? [];

  return {
    reports,
    error,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    invalidateReports,
  };
}
