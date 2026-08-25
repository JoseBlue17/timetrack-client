import type { ReportStatus } from '@/enums';

export interface BackendMonthlyReport {
  id?: string;
  _id?: string;
  userId?: string;
  month: number;
  year: number;
  totalHours?: number;
  totalAmount?: number;
  status?: string;
  employeeSigned?: boolean;
  firstName?: string;
  lastName?: string;
  supervisorId?: string;
  supervisorName?: string;
  paymentId?: string | null;
}

export interface IReportsPaginatedResponse {
  data: BackendMonthlyReport[];
  nextCursor: string | null;
}

export interface IMonthlyReport {
  id: string;
  userId: string;
  monthName: string;
  month: number;
  year: number;
  totalWorkedHours: number;
  totalAmountInUsdt: number;
  reportStatus: ReportStatus;
  isSigned: boolean;
  userName?: string;
  supervisorName?: string;
  paymentId?: string | null;
}

export interface IOldPdfReport {
  id: string;
  pdfFileName: string;
  referenceMonth: string;
  uploadedAtDate: string;
}

export interface IReportPdfResponse {
  url?: string;
}

export interface IMonthlySummaryTimesheet {
  id: string;
  date: string;
}

export interface IMonthlySummaryResponse {
  totalHours: number;
  totalAmount?: number;
  uniqueDays?: number;
  totalFacturado?: number;
  totalEntries?: number;
  timesheets?: IMonthlySummaryTimesheet[];
}
