import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

import { Http } from '@/config/http';
import { cursorParams } from '@/helpers/cursor-params';
import { TIMESHEETS_QUERY_KEY } from '@/query-keys';
import type {
  IGetTimesheetsParams,
  IGetTimesheetsResponse,
  ITimesheet,
} from '../timesheet.interface';

export function useGetTimesheets(params: IGetTimesheetsParams = {}) {
  const queryClient = useQueryClient();

  const { data: timesheets = [], ...rest } = useInfiniteQuery<
    IGetTimesheetsResponse,
    Error,
    ITimesheet[],
    readonly ['TIMESHEETS', IGetTimesheetsParams],
    string | undefined
  >({
    queryKey: [...TIMESHEETS_QUERY_KEY, params],
    queryFn: async ({ pageParam }) => {
      const { data } = await Http.get<IGetTimesheetsResponse>('/timesheets', {
        params: cursorParams(pageParam, params),
      });
      return data;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    select: (data) => data.pages.flatMap((page) => page.timesheets),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: TIMESHEETS_QUERY_KEY });
  };

  return { timesheets, ...rest, invalidate };
}
