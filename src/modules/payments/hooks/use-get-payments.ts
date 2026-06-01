import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Http } from '@/config/http';
import type { IPayment } from '@/interfaces';
import type { IPaginatedResponse } from '@/interfaces';

export const PAYMENTS_QUERY_KEY = ['PAYMENTS'];

interface GetPaymentsParams {
  status?: string;
  cursor?: string;
  limit?: number;
}

export function useGetPayments(params?: GetPaymentsParams) {
  const queryClient = useQueryClient();

  const { data: response, ...rest } = useQuery<IPaginatedResponse<IPayment>>({
    queryKey: [...PAYMENTS_QUERY_KEY, params],
    queryFn: () => Http.get('/payments', { params }).then(({ data }) => data),
  });

  const invalidatePayments = () => {
    queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
  };

  return {
    ...rest,
    payments: response?.data ?? [],
    nextCursor: response?.nextCursor ?? null,
    invalidatePayments,
  };
}
