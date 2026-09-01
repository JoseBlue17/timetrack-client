import { ReportStatus } from '@/enums';
import type { BackendMonthlyReport, IMonthlyReport } from '../components/reports.interface';

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

export function mapToMonthlyReport(backend: BackendMonthlyReport): IMonthlyReport {
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
