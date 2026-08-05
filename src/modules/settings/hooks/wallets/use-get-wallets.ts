import { useQuery } from '@tanstack/react-query';
import { Http } from '@/config/http';
import type { IWallet } from '@/interfaces';
import { useInvalidateWallets } from '@/hooks';
import { WALLETS_QUERY_KEY } from '@/query-keys';

export function useGetWallets() {
  const { data: wallets = [], ...rest } = useQuery<IWallet[]>({
    queryKey: WALLETS_QUERY_KEY,
    queryFn: () => Http.get('/wallets').then(({ data }) => data),
  });

  const invalidateWallets = useInvalidateWallets();

  return { ...rest, wallets, invalidateWallets };
}
