import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { ReportStatus } from '@/enums';
import type { IMonthlyReport } from '../components/reports.interface';

interface BackendMonthlyReport {
  id?: string;
  _id?: string;
  month: number;
  year: number;
  totalHours?: number;
  totalAmount?: number;
  status?: string;
  employeeSigned?: boolean;
  firstName?: string;
  lastName?: string;
}

interface IReportsPaginatedResponse {
  data: BackendMonthlyReport[];
  nextCursor: string | null;
}

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
    monthName: `${MONTH_NAMES[backend.month - 1]} ${backend.year}`,
    month: backend.month,
    year: backend.year,
    totalWorkedHours: backend.totalHours || 0,
    totalAmountInUsdt: backend.totalAmount || 0,
    reportStatus: BACKEND_TO_ENUM[backend.status ?? ''] ?? ReportStatus.Draft,
    isSigned: backend.employeeSigned || false,
    userName: fullName || undefined,
  };
}

export const REPORTS_LIST_QUERY_KEY = ['REPORTS_LIST'];

export function useGetReports() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: REPORTS_LIST_QUERY_KEY,
    queryFn: () =>
      Http.get<IReportsPaginatedResponse>('/reports').then(({ data }) =>
        data.data.map(mapToMonthlyReport),
      ),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: REPORTS_LIST_QUERY_KEY });
  };

  return { ...query, reports: query.data, invalidate };
}
