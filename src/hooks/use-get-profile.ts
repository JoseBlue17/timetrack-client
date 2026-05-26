import { useQuery } from '@tanstack/react-query';
import { Http } from '@/config/http';
import type { IUserMeResponse } from '@/interfaces';

export const USER_PROFILE_QUERY_KEY = ['USER_PROFILE'];

export function useGetProfile() {
  const query = useQuery({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: () => Http.get<IUserMeResponse>('/users/me').then(({ data }) => data.user),
  });

  return { ...query, user: query.data };
}
