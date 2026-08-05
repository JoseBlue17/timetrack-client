import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { Http } from '@/config/http';
import type { IMonthlySummaryResponse } from '../components/reports.interface';
import { MONTHLY_SUMMARY_QUERY_KEY } from '@/query-keys';

export const useGetMonthlySummary = (month: number, year: number) => {
  const {
    data: monthlySummaryData,
    isLoading: isSummaryLoading,
    ...rest
  }: UseQueryResult<IMonthlySummaryResponse, Error> = useQuery({
    queryKey: [...MONTHLY_SUMMARY_QUERY_KEY, month, year],
    queryFn: () =>
      Http.get(`/timesheets/summary/monthly?month=${month}&year=${year}`).then(({ data }) => data),
  });

  return { monthlySummaryData, isSummaryLoading, ...rest };
};
