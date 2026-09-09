import type { IPayment } from '@/interfaces';

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
