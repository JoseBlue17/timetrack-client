import { useMutation } from '@tanstack/react-query';
import { Http } from '@/config/http';
import {
  useShowError,
  useShowSuccess,
  useInvalidateWallets,
  useInvalidateMonthlyReports,
} from '@/hooks';
import type { AxiosResponseError } from '@/config/http';
import type { IWallet } from '@/interfaces';

export interface IAddWalletValues {
  network: string;
  walletAddress: string;
  label?: string;
  isDefault?: boolean;
}

export function useAddWallet() {
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();
  const invalidateWallets = useInvalidateWallets();
  const invalidateMonthlyReports = useInvalidateMonthlyReports();

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
      invalidateMonthlyReports();
    },
    onError: (error: AxiosResponseError) => showError(error),
  });
}
