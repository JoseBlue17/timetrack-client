import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Http } from '@/config/http';
import type { IWallet } from '@/interfaces';

const WALLETS_QUERY_KEY = ['WALLETS'];

export function useGetWallets() {
  const queryClient = useQueryClient();

  const { data: wallets = [], ...rest } = useQuery<IWallet[]>({
    queryKey: WALLETS_QUERY_KEY,
    queryFn: () => Http.get('/wallets').then(({ data }) => data),
  });

  const invalidateWallets = () => {
    queryClient.invalidateQueries({ queryKey: WALLETS_QUERY_KEY });
  };

  return { ...rest, wallets, invalidateWallets };
}
