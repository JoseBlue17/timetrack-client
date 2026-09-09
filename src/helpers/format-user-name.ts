import type { IPayment } from '@/interfaces';

export function formatUserName(payment: IPayment | null): string {
  if (!payment) return 'Usuario';
  const first = payment.firstName ?? '';
  const last = payment.lastName ?? '';
  const full = `${first} ${last}`.trim();
  return full || 'Usuario';
}
