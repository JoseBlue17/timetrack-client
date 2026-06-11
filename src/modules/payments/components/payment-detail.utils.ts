import type { IPayment } from '@/interfaces';

export function formatDate(date?: Date | string): string {
  if (!date) return '--';
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatUserName(payment: IPayment | null): string {
  if (!payment) return 'Usuario';
  const first = payment.firstName ?? '';
  const last = payment.lastName ?? '';
  const full = `${first} ${last}`.trim();
  return full || 'Usuario';
}

export function copyToClipboard(text?: string): void {
  if (!text) return;
  navigator.clipboard.writeText(text);
}

export function copyPaymentDetails(payment: IPayment): void {
  const details = [
    `Red: ${payment.network}`,
    `Monto: ${payment.amountExpected} USDT`,
    `Wallet: ${payment.walletAddress}`,
  ].join('\n');
  navigator.clipboard.writeText(details);
}

export function openBinanceWithdrawal(): void {
  window.open('https://www.binance.com/es-LA/my/wallet/account/withdrawal', '_blank');
}
