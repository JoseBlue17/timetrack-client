import { ReportStatus } from '@/enums';

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
