import { useMutation } from '@tanstack/react-query';
import { Http } from '@/config/http';
import {
  useShowError,
  useShowSuccess,
  useInvalidateWallets,
  useInvalidateMonthlyReports,
} from '@/hooks';
import type { AxiosResponseError } from '@/config/http';

export interface IDeleteWalletPayload {
  walletId: string;
}

export function useDeleteWallet() {
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();
  const invalidateWallets = useInvalidateWallets();
  const invalidateMonthlyReports = useInvalidateMonthlyReports();

  return useMutation<void, AxiosResponseError, IDeleteWalletPayload>({
    mutationKey: ['DELETE_WALLET'],
    mutationFn: ({ walletId }: IDeleteWalletPayload) =>
      Http.delete(`/wallets/${walletId}`).then((r) => r.data),
    onSuccess: () => {
      showSuccess({
        title: 'Wallet eliminada',
        description: 'La wallet fue eliminada correctamente.',
      });
      invalidateWallets();
      invalidateMonthlyReports();
    },
    onError: (error: AxiosResponseError) => showError(error),
  });
}
