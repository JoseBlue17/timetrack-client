import { useMutation } from '@tanstack/react-query';
import { Http } from '@/config/http';
import {
  useShowError,
  useShowSuccess,
  useInvalidateWallets,
  useInvalidateMonthlyReports,
} from '@/hooks';
import type { AxiosResponseError } from '@/config/http';

export interface ISetDefaultWalletPayload {
  walletId: string;
}

export function useSetDefaultWallet() {
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();
  const invalidateWallets = useInvalidateWallets();
  const invalidateMonthlyReports = useInvalidateMonthlyReports();

  return useMutation<void, AxiosResponseError, ISetDefaultWalletPayload>({
    mutationKey: ['SET_DEFAULT_WALLET'],
    mutationFn: ({ walletId }: ISetDefaultWalletPayload) =>
      Http.patch(`/wallets/${walletId}/default`).then((r) => r.data),
    onSuccess: () => {
      showSuccess({
        title: 'Wallet por defecto actualizada',
        description: 'La wallet principal fue cambiada correctamente.',
      });
      invalidateWallets();
      invalidateMonthlyReports();
    },
    onError: (error: AxiosResponseError) => showError(error),
  });
}
