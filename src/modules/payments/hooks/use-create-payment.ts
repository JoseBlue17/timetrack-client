import { useMutation } from '@tanstack/react-query';
import { Http } from '@/config/http';
import {
  useShowError,
  useShowSuccess,
  useInvalidatePayments,
  useInvalidateMonthlyReports,
} from '@/hooks';
import type { AxiosResponseError } from '@/config/http';

export interface ICreatePaymentPayload {
  reportId: string;
  walletId: string;
}

export function useCreatePayment() {
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();
  const invalidatePayments = useInvalidatePayments();
  const invalidateMonthlyReports = useInvalidateMonthlyReports();

  return useMutation<unknown, AxiosResponseError, ICreatePaymentPayload>({
    mutationKey: ['CREATE_PAYMENT'],
    mutationFn: ({ reportId, walletId }: ICreatePaymentPayload) =>
      Http.post('/payments', { reportId, walletId }).then((r) => r.data),
    onSuccess: () => {
      showSuccess({
        title: 'Pago creado',
        description: 'El pago ha sido creado correctamente.',
      });
      invalidatePayments();
      invalidateMonthlyReports();
    },
    onError: (error: AxiosResponseError) => showError(error),
  });
}
