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

const PAYMENTS_QUERY_KEY = ['PAYMENTS'];

export function useGetPayments(params?: GetPaymentsParams) {
  const queryClient = useQueryClient();

  const { data: paymentsData, ...rest } = useQuery<
    IPaginatedResponse<IPayment>,
    AxiosResponseError
  >({
    queryKey: [...PAYMENTS_QUERY_KEY, params],
    queryFn: () =>
      Http.get<IPaginatedResponse<IPayment>>('/payments', { params }).then(({ data }) => data),
  });

  const invalidatePayments = () => {
    queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
  };

  return {
    ...rest,
    payments: paymentsData?.data ?? [],
    nextCursor: paymentsData?.nextCursor ?? null,
    invalidatePayments,
  };
}
