import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { Http } from '@/config/http';
import type {
  IGetTimesheetsParams,
  IGetTimesheetsResponse,
  ITimesheet,
} from '../components/timesheet.interface';

const TIMESHEETS_QUERY_KEY = ['TIMESHEETS'] as const;

export function useGetTimesheets(params: IGetTimesheetsParams = {}) {
  const queryClient = useQueryClient();

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

  const invalidateTimesheets = () => {
    queryClient.invalidateQueries({ queryKey: TIMESHEETS_QUERY_KEY });
  };

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
