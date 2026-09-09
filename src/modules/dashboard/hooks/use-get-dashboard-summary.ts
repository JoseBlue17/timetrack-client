import { useQuery } from '@tanstack/react-query';

import { Http } from '@/config/http';
import { DASHBOARD_SUMMARY_QUERY_KEY } from '@/query-keys';

import type { IDashboardSummary } from '../dashboard.interface';

interface GetDashboardSummaryParams {
  month?: number;
  year?: number;
}

export function useGetDashboardSummary(params: GetDashboardSummaryParams = {}) {
  const { data: dashboardSummary, ...rest } = useQuery<IDashboardSummary, Error>({
    queryKey: [...DASHBOARD_SUMMARY_QUERY_KEY, params],
    queryFn: () =>
      Http.get<IDashboardSummary>('/dashboard/summary', { params }).then(({ data }) => data),
  });

  return { dashboardSummary, ...rest };
}
