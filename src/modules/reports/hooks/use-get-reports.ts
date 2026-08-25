import { useQuery } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { ReportStatus } from '@/enums';
import type {
  BackendMonthlyReport,
  IReportsPaginatedResponse,
  IMonthlyReport,
} from '../components/reports.interface';
import { useInvalidateMonthlyReports } from '@/hooks';
import { REPORTS_LIST_QUERY_KEY } from '@/query-keys';

const BACKEND_TO_ENUM: Record<string, ReportStatus> = {
  draft: ReportStatus.Draft,
  submitted: ReportStatus.Submitted,
  signed_by_employee: ReportStatus.SignedByEmployee,
  approved: ReportStatus.Approved,
  rejected: ReportStatus.Rejected,
  paid: ReportStatus.Paid,
  closed: ReportStatus.Closed,
};

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

export function useGetReports() {
  const { data: reports = [], ...rest } = useQuery({
    queryKey: REPORTS_LIST_QUERY_KEY,
    queryFn: () =>
      Http.get<IReportsPaginatedResponse>('/reports').then(({ data }) =>
        data.data.map(mapToMonthlyReport),
      ),
  });

  const invalidateReports = useInvalidateMonthlyReports();

  return { ...rest, reports, invalidateReports };
}
