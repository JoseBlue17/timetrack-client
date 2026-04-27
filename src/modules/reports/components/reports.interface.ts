export type MonthlyReportStatus = 'Borrador' | 'Aprobado' | 'Pagado';

export interface IMonthlyReport {
  id: string;
  monthName: string;
  totalWorkedHours: number;
  totalAmountInUsdt: number;
  reportStatus: MonthlyReportStatus;
  isSigned: boolean;
}

export interface IOldPdfReport {
  id: string;
  pdfFileName: string;
  referenceMonth: string;
  uploadedAtDate: string;
}
