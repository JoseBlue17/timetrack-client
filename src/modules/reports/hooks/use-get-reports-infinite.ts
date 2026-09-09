import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

import { Http } from '@/config/http';
import { cursorParams } from '@/helpers/cursor-params';
import type { AxiosResponseError } from '@/config/http';
import { REPORTS_LIST_QUERY_KEY } from '@/query-keys';
import type { IReportsPaginatedResponse, IMonthlyReport } from '../reports.interface';
import { mapToMonthlyReport } from '../helpers/map-monthly-report';

async function getReportsPage(cursor?: string): Promise<IReportsPaginatedResponse> {
  const { data } = await Http.get<IReportsPaginatedResponse>('/reports', {
    params: cursorParams(cursor),
  });

  return data;
}

export function useGetReportsInfinite() {
  const queryClient = useQueryClient();

  const { data: reports = [], ...rest } = useInfiniteQuery<
    IReportsPaginatedResponse,
    AxiosResponseError,
    IMonthlyReport[],
    readonly ['REPORTS_LIST', 'infinite'],
    string | undefined
  >({
    queryKey: [...REPORTS_LIST_QUERY_KEY, 'infinite'],
    queryFn: async ({ pageParam }) => getReportsPage(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    select: (data) => data.pages.flatMap((page) => page.data.map(mapToMonthlyReport)),
    staleTime: 30_000,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: REPORTS_LIST_QUERY_KEY });
  };

  return { ...rest, reports, invalidate };
}
