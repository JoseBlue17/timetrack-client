import { useQuery } from '@tanstack/react-query';
import { Http } from '@/config/http';
import type { IWallet } from '@/interfaces';
import { USER_WALLETS_QUERY_KEY } from '@/query-keys';

export function useGetUserWallets(userId: string | undefined) {
  return useQuery<IWallet[]>({
    queryKey: [...USER_WALLETS_QUERY_KEY, userId],
    queryFn: () => Http.get(`/wallets/user/${userId}`).then(({ data }) => data),
    enabled: !!userId,
  });
}
