import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { useShowError, useShowSuccess } from '@/hooks';
import type { AxiosResponseError } from '@/config/http';
import { useGetWallets } from './use-get-wallets';

export interface ISetDefaultWalletPayload {
  walletId: string;
}

export function useSetDefaultWallet() {
  const queryClient = useQueryClient();
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();
  const { invalidateWallets } = useGetWallets();

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
      queryClient.invalidateQueries({ queryKey: ['REPORTS_LIST'] });
    },
    onError: (error: AxiosResponseError) => showError(error),
  });
}
