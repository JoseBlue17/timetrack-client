import { PaymentStatus, ReportStatus } from '@/enums';

export const MONTH_NAMES = [
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

export function formatUsdt(value = 0) {
  return `${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(value)} USDT`;
}

export function formatHours(value = 0) {
  return `${new Intl.NumberFormat('es-ES', {
    maximumFractionDigits: 2,
  }).format(value)}h`;
}

export function formatMonthYear(month: number, year: number) {
  return `${MONTH_NAMES[month - 1] ?? ''} ${year}`.trim();
}

export function formatDate(date?: string) {
  if (!date) return 'Fecha pendiente';

  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function shortenTxid(txid?: string) {
  if (!txid) return 'TX pendiente';
  if (txid.length <= 14) return txid;
  return `TX: ${txid.slice(0, 6)}...${txid.slice(-4)}`;
}

export function getPaymentAmount(payment: { amountReceived?: number; amountExpected?: number }) {
  return payment.amountReceived && payment.amountReceived > 0
    ? payment.amountReceived
    : payment.amountExpected;
}

export function getPaymentStatusLabel(status?: string) {
  const labels: Record<string, string> = {
    [PaymentStatus.Pending]: 'Pendiente',
    [PaymentStatus.Completed]: 'Completado',
    [PaymentStatus.Failed]: 'Fallido',
    [PaymentStatus.Expired]: 'Expirado',
  };

  return labels[status ?? ''] ?? status ?? 'Sin estado';
}

export function getPaymentStatusColor(status?: string) {
  const colors: Record<string, string> = {
    [PaymentStatus.Pending]: 'warning',
    [PaymentStatus.Completed]: 'success',
    [PaymentStatus.Failed]: 'error',
    [PaymentStatus.Expired]: 'default',
  };

  return colors[status ?? ''] ?? 'default';
}

export function getReportStatusLabel(status?: string) {
  const labels: Record<string, string> = {
    [ReportStatus.Draft]: 'Borrador',
    [ReportStatus.Submitted]: 'Enviado',
    [ReportStatus.SignedByEmployee]: 'Esperando aprobación',
    [ReportStatus.Approved]: 'Aprobado',
    [ReportStatus.Rejected]: 'Rechazado',
    [ReportStatus.Paid]: 'Pagado',
    [ReportStatus.Closed]: 'Cerrado',
  };

  return labels[status ?? ''] ?? status ?? 'Sin estado';
}

export function getReportStatusColor(status?: string) {
  const colors: Record<string, string> = {
    [ReportStatus.Draft]: 'default',
    [ReportStatus.Submitted]: 'processing',
    [ReportStatus.SignedByEmployee]: 'warning',
    [ReportStatus.Approved]: 'success',
    [ReportStatus.Rejected]: 'error',
    [ReportStatus.Paid]: 'processing',
    [ReportStatus.Closed]: 'default',
  };

  return colors[status ?? ''] ?? 'default';
}
