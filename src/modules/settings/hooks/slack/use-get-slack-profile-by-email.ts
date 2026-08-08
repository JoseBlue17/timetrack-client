import { useQuery } from '@tanstack/react-query';
import { Http } from '@/config/http';
import type { AxiosResponseError } from '@/config/http';
import type { ISlackProfile } from '@/interfaces';
import { SLACK_PROFILE_QUERY_KEY } from '@/query-keys';

export function useGetSlackProfileByEmail(email: string | null) {
  return useQuery<ISlackProfile, AxiosResponseError>({
    queryKey: [...SLACK_PROFILE_QUERY_KEY, 'email', email],
    queryFn: () =>
      Http.get<ISlackProfile>('/auth/slack/profile', {
        params: { email },
      }).then(({ data }) => data),
    enabled: !!email,
  });
}
