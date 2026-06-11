import { useQuery } from '@tanstack/react-query';
import { Http } from '@/config/http';
import type { IWallet } from '@/interfaces';

export function useGetUserWallets(userId: string | undefined) {
  return useQuery<IWallet[]>({
    queryKey: ['USER_WALLETS', userId],
    queryFn: () => Http.get(`/wallets/user/${userId}`).then(({ data }) => data),
    enabled: !!userId,
  });
}
