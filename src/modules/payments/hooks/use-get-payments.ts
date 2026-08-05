import { useQuery } from '@tanstack/react-query';
import { Http } from '@/config/http';
import type { AxiosResponseError } from '@/config/http';
import type { IPayment } from '@/interfaces';
import type { IPaginatedResponse } from '@/interfaces';
import { useInvalidatePayments } from '@/hooks';
import { PAYMENTS_QUERY_KEY } from '@/query-keys';

interface GetPaymentsParams {
  status?: string;
  excludeStatus?: string;
  cursor?: string;
  limit?: number;
}

export function useGetPayments(params?: GetPaymentsParams) {
  const { data: paymentsData, ...rest } = useQuery<
    IPaginatedResponse<IPayment>,
    AxiosResponseError
  >({
    queryKey: [...PAYMENTS_QUERY_KEY, params],
    queryFn: () =>
      Http.get<IPaginatedResponse<IPayment>>('/payments', { params }).then(({ data }) => data),
  });

  const invalidatePayments = useInvalidatePayments();

  return {
    ...rest,
    payments: paymentsData?.data ?? [],
    nextCursor: paymentsData?.nextCursor ?? null,
    invalidatePayments,
  };
}
