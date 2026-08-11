import { useQuery } from '@tanstack/react-query';
import { Http } from '@/config/http';
import type { IWallet } from '@/interfaces';
import { useInvalidateWallets } from '@/hooks';
import { WALLETS_QUERY_KEY } from '@/query-keys';

export function useGetWallets(userId?: string) {
  const { data: wallets = [], ...rest } = useQuery<IWallet[]>({
    queryKey: [...WALLETS_QUERY_KEY, userId],
    queryFn: () =>
      Http.get('/wallets', { params: userId ? { userId } : undefined }).then(({ data }) => data),
  });

  const invalidateWallets = useInvalidateWallets();

  return { ...rest, wallets, invalidateWallets };
}
