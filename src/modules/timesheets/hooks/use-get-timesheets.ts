import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { Http } from '@/config/http';
import type {
  IGetTimesheetsParams,
  IGetTimesheetsResponse,
  ITimesheet,
} from '../components/timesheet.interface';

export function useGetTimesheets(params: IGetTimesheetsParams = {}) {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery<
    IGetTimesheetsResponse,
    Error,
    ITimesheet[],
    ['TIMESHEETS', IGetTimesheetsParams],
    string | undefined
  >({
    queryKey: ['TIMESHEETS', params],
    queryFn: async ({ pageParam }) => {
      const { data } = await Http.get<IGetTimesheetsResponse>('/timesheets', {
        params: {
          ...params,
          ...(pageParam ? { cursor: pageParam } : {}),
        },
      });
      return data;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    select: (data) => data.pages.flatMap((page) => page.timesheets),
  });

  const invalidateTimesheets = () => {
    queryClient.invalidateQueries({ queryKey: ['TIMESHEETS'] });
  };

  return { ...query, invalidateTimesheets };
}
