import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
vi.mock('../hooks/use-payments-table', () => ({
  usePaymentsTable: () => ({
    payments: [
      { id: 'p1', status: 'pending', network: 'BEP20', walletAddress: `0x${'a'.repeat(40)}` },
    ],
    isLoading: false,
  }),
}));
vi.mock('@/hooks', () => ({ useCanEditConfiguration: () => true }));
vi.mock('./payment-detail-modal', () => ({ PaymentDetailModal: () => null }));
vi.mock('./payment-status-filter', () => ({ PaymentStatusFilter: () => null }));
import { PaymentsTable } from './payments-table';

describe('payment navigation', () => {
  it('opens Binance without giving the destination window an opener', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    render(<PaymentsTable />);
    fireEvent.click(screen.getByTitle('Abrir Binance para pagar'));
    expect(open).toHaveBeenCalledWith(
      'https://www.binance.com/es-LA/my/wallet/account/withdrawal',
      '_blank',
      'noopener,noreferrer',
    );
  });
});
