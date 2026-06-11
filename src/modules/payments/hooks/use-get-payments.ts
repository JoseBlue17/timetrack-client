import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Http } from '@/config/http';
import type { AxiosResponseError } from '@/config/http';
import type { IPayment } from '@/interfaces';
import type { IPaginatedResponse } from '@/interfaces';

interface GetPaymentsParams {
  status?: string;
  excludeStatus?: string;
  cursor?: string;
  limit?: number;
}

export function useGetPayments(params?: GetPaymentsParams) {
  const queryClient = useQueryClient();

  const query = useQuery<IPaginatedResponse<IPayment>, AxiosResponseError>({
    queryKey: ['PAYMENTS', params],
    queryFn: () => Http.get('/payments', { params }).then(({ data }) => data),
  });

  const invalidatePayments = () => {
    queryClient.invalidateQueries({ queryKey: ['PAYMENTS'] });
  };

  return {
    payments: query.data?.data ?? [],
    nextCursor: query.data?.nextCursor ?? null,
    ...query,
    invalidatePayments,
  };
}
