import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ add: vi.fn() }));
vi.mock('../../hooks/wallets/use-add-wallet', () => ({
  useAddWallet: () => ({ mutate: mocks.add, isPending: false }),
}));
vi.mock('../../hooks/wallets/use-update-wallet', () => ({
  useUpdateWallet: () => ({ mutate: vi.fn(), isPending: false }),
}));
vi.mock('@/hooks', () => ({ useFormErrorHandler: () => vi.fn() }));
import { WalletFormModal } from './wallet-form-modal';

describe('wallet form submission', () => {
  it('trims whitespace without changing address case before submitting', async () => {
    const address = '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359';
    render(<WalletFormModal open onClose={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText('0x... o T...'), {
      target: { value: ` ${address} ` },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Agregar wallet' }));
    await waitFor(() => expect(mocks.add).toHaveBeenCalled(), {
      onTimeout: (error) =>
        new Error(`${error.message}\nFORM: ${document.querySelector('form')?.textContent}`),
    });
    expect(mocks.add.mock.calls[0][0].walletAddress).toBe(address);
  });
});
