import { useInfiniteQuery } from '@tanstack/react-query';
import { Http } from '@/config/http';
import type {
  IGetTimesheetsParams,
  IGetTimesheetsResponse,
  ITimesheet,
} from '../components/timesheet.interface';
import { useInvalidateTimesheets } from '@/hooks';
import { TIMESHEETS_QUERY_KEY } from '@/query-keys';

export function useGetTimesheets(params: IGetTimesheetsParams = {}) {
  const {
    data: timesheets = [],
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    IGetTimesheetsResponse,
    Error,
    ITimesheet[],
    ['TIMESHEETS', IGetTimesheetsParams],
    string | undefined
  >({
    queryKey: [...TIMESHEETS_QUERY_KEY, params],
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

  const invalidateTimesheets = useInvalidateTimesheets();

  return {
    timesheets,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    invalidateTimesheets,
  };
}
