import type { ReportStatus } from '@/enums';

export interface IMonthlyReport {
  id: string;
  monthName: string;
  month: number;
  year: number;
  totalWorkedHours: number;
  totalAmountInUsdt: number;
  reportStatus: ReportStatus;
  isSigned: boolean;
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
