import { useInfiniteQuery } from '@tanstack/react-query';
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
}

export function useGetPayments(params?: GetPaymentsParams) {
  const { data: payments = [], ...rest } = useInfiniteQuery<
    IPaginatedResponse<IPayment>,
    AxiosResponseError,
    IPayment[],
    [string, GetPaymentsParams | undefined],
    string | undefined
  >({
    queryKey: [...PAYMENTS_QUERY_KEY, params],
    queryFn: ({ pageParam }) =>
      Http.get<IPaginatedResponse<IPayment>>('/payments', {
        params: {
          ...params,
          ...(pageParam ? { cursor: pageParam } : {}),
        },
      }).then(({ data }) => data),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    select: (data) => data.pages.flatMap((page) => page.data),
  });

  const invalidatePayments = useInvalidatePayments();

  return {
    ...rest,
    payments,
    invalidatePayments,
  };
}
