import { ReportStatus } from '@/enums';

export interface StatusMapping {
  label: string;
  color: 'orange' | 'green' | 'red' | 'blue' | 'gray' | 'purple' | 'cyan';
}

export const AdminReportStatusMap: Partial<Record<ReportStatus, StatusMapping>> = {
  [ReportStatus.SignedByEmployee]: { label: 'Pendiente de Revisión', color: 'orange' },
  [ReportStatus.Approved]: { label: 'Aprobado', color: 'green' },
  [ReportStatus.Rejected]: { label: 'Devuelto', color: 'red' },
  [ReportStatus.Paid]: { label: 'Pagado', color: 'blue' },
};

export const EmployeeReportStatusMap: Partial<Record<ReportStatus, StatusMapping>> = {
  [ReportStatus.Draft]: { label: 'Borrador', color: 'gray' },
  [ReportStatus.SignedByEmployee]: { label: 'Enviado a Revisión', color: 'orange' },
  [ReportStatus.Rejected]: { label: 'Requiere Correcciones', color: 'red' },
  [ReportStatus.Approved]: { label: 'Aprobado', color: 'green' },
  [ReportStatus.Paid]: { label: 'Pagado', color: 'blue' },
};

const STATUS_MAPPING_BY_ROLE: Record<string, Partial<Record<ReportStatus, StatusMapping>>> = {
  admin: AdminReportStatusMap,
  superAdmin: AdminReportStatusMap,
  basic: EmployeeReportStatusMap,
};

export function getReportStatusMapping(status: ReportStatus, role: string): StatusMapping {
  const roleMapping = STATUS_MAPPING_BY_ROLE[role] ?? EmployeeReportStatusMap;
  return roleMapping[status] ?? { label: status, color: 'gray' };
}

export const STATUS_TAG_COLORS: Record<string, string> = {
  orange: 'warning',
  green: 'success',
  red: 'error',
  blue: 'processing',
  gray: 'default',
  purple: 'purple',
  cyan: 'cyan',
};
