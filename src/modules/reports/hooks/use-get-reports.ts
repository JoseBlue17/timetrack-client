import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { REPORTS_LIST_QUERY_KEY } from '@/query-keys';
import type { IReportsPaginatedResponse } from '../components/reports.interface';
import { mapToMonthlyReport } from '../helpers/map-monthly-report';

export function useGetReports() {
  const queryClient = useQueryClient();

  const { data: reports = [], ...rest } = useQuery({
    queryKey: REPORTS_LIST_QUERY_KEY,
    queryFn: () =>
      Http.get<IReportsPaginatedResponse>('/reports').then(({ data }) =>
        data.data.map(mapToMonthlyReport),
      ),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: REPORTS_LIST_QUERY_KEY });
  };

  return { ...rest, reports, invalidate };
}
