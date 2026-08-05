import { useMutation } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { useShowError, useShowSuccess, useInvalidateWallets } from '@/hooks';
import type { AxiosResponseError } from '@/config/http';
import type { IWallet } from '@/interfaces';

export interface IUpdateWalletValues {
  walletAddress?: string;
  label?: string;
  status?: string;
}

export interface IUpdateWalletPayload {
  walletId: string;
  values: IUpdateWalletValues;
}

export function useUpdateWallet() {
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();
  const invalidateWallets = useInvalidateWallets();

  return useMutation<IWallet, AxiosResponseError, IUpdateWalletPayload>({
    mutationKey: ['UPDATE_WALLET'],
    mutationFn: ({ walletId, values }: IUpdateWalletPayload) =>
      Http.patch<IWallet>(`/wallets/${walletId}`, values).then((r) => r.data),
    onSuccess: () => {
      showSuccess({
        title: 'Wallet actualizada',
        description: 'Los cambios fueron guardados correctamente.',
      });
      invalidateWallets();
    },
    onError: (error: AxiosResponseError) => showError(error),
  });
}
