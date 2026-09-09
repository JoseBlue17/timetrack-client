import { PaymentStatus } from '@/enums';

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
