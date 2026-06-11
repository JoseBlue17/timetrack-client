import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { useShowError, useShowSuccess } from '@/hooks';
import type { AxiosResponseError } from '@/config/http';
import type { IWallet } from '@/interfaces';
import { useGetWallets } from './use-get-wallets';

export interface IAddWalletValues {
  network: string;
  walletAddress: string;
  label?: string;
  isDefault?: boolean;
}

export function useAddWallet() {
  const queryClient = useQueryClient();
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();
  const { invalidateWallets } = useGetWallets();

  return useMutation<IWallet, AxiosResponseError, IAddWalletValues>({
    mutationKey: ['ADD_WALLET'],
    mutationFn: (values: IAddWalletValues) =>
      Http.post<IWallet>('/wallets', values).then((r) => r.data),
    onSuccess: () => {
      showSuccess({
        title: 'Wallet agregada',
        description: 'La wallet fue registrada correctamente.',
      });
      invalidateWallets();
      queryClient.invalidateQueries({ queryKey: ['REPORTS_LIST'] });
    },
    onError: (error: AxiosResponseError) => showError(error),
  });
}
