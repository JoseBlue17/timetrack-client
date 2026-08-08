import { useQuery } from '@tanstack/react-query';
import { Http } from '@/config/http';
import type { AxiosResponseError } from '@/config/http';
import type { ISlackProfile } from '@/interfaces';
import { SLACK_PROFILE_QUERY_KEY } from '@/query-keys';

export function useGetSlackProfileById(slackUserId: string | null) {
  return useQuery<ISlackProfile, AxiosResponseError>({
    queryKey: [...SLACK_PROFILE_QUERY_KEY, 'userId', slackUserId],
    queryFn: () =>
      Http.get<ISlackProfile>(`/auth/slack/user/${slackUserId}/profile`).then(({ data }) => data),
    enabled: !!slackUserId,
  });
}
