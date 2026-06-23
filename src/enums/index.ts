export const UserRole = {
  Admin: 'admin',
  Basic: 'basic',
  SuperAdmin: 'superAdmin',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserStatus = {
  Active: 'active',
  Inactive: 'inactive',
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const ReportStatus = {
  Draft: 'draft',
  Submitted: 'submitted',
  SignedByEmployee: 'signed_by_employee',
  Approved: 'approved',
  Rejected: 'rejected',
  Paid: 'paid',
  Closed: 'closed',
} as const;
export type ReportStatus = (typeof ReportStatus)[keyof typeof ReportStatus];

export const EmployeePosition = {
  QA: 'Control y Aseguramiento de Calidad QA',
  BACKEND: 'Programador Backend',
  FRONTEND: 'Programador Frontend',
  DATA_ANALYST: 'Analista de Datos',
  FULLSTACK: 'Programador FullStack',
  CLOUD_ENGINEER: 'Ingeniero Cloud',
  DATA_SCIENTIST: 'Cientifico de Datos',
} as const;
export type EmployeePosition = (typeof EmployeePosition)[keyof typeof EmployeePosition];

export const PaymentStatus = {
  Pending: 'pending',
  Completed: 'completed',
  Failed: 'failed',
  Expired: 'expired',
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const BlockchainNetwork = {
  TRC20: 'TRC20',
  BEP20: 'BEP20',
} as const;
export type BlockchainNetwork = (typeof BlockchainNetwork)[keyof typeof BlockchainNetwork];
