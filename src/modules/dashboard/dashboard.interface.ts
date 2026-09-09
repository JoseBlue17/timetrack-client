export interface IDashboardWeeklyHours {
  date: string;
  dayLabel: string;
  hours: number;
}

export interface IDashboardReport {
  id: string;
  userId: string;
  month: number;
  year: number;
  totalHours: number;
  totalAmount: number;
  status: string;
  paymentId: string | null;
}

export interface IDashboardPayment {
  id: string;
  userId: string;
  reportId: string;
  amountExpected: number;
  amountReceived: number;
  status: string;
  txid?: string;
  network: string;
  paidAt?: string;
  createdAt?: string;
}

export interface IDashboardSummary {
  month: number;
  year: number;
  monthlyHours: number;
  previousMonthHours: number;
  monthlyHoursDeltaPercent: number;
  estimatedEarnings: number;
  hourlyRate: number;
  pendingReportsCount: number;
  lastPayment: IDashboardPayment | null;
  weeklyHours: IDashboardWeeklyHours[];
  latestReports: IDashboardReport[];
  paymentHistory: IDashboardPayment[];
}
