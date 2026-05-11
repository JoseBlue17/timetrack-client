import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { Http } from '@/config/http';
import type { IMonthlySummaryResponse } from '../components/reports.interface';

export const useGetMonthlySummary = (month: number, year: number) => {
  const {
    data: monthlySummaryData,
    isLoading: isSummaryLoading,
    ...rest
  }: UseQueryResult<IMonthlySummaryResponse, Error> = useQuery({
    queryKey: ['MONTHLY_SUMMARY', month, year],
    queryFn: () =>
      Http.get(`/reports/monthly-summary?month=${month}&year=${year}`).then(({ data }) => data),
  });

  return { monthlySummaryData, isSummaryLoading, ...rest };
};
