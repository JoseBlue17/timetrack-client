import { useMutation } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { useShowError, useShowSuccess, useInvalidatePayments } from '@/hooks';
import type { AxiosResponseError } from '@/config/http';

export interface IDeletePaymentPayload {
  paymentId: string;
}

export function useDeletePayment() {
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();
  const invalidatePayments = useInvalidatePayments();

  return useMutation<void, AxiosResponseError, IDeletePaymentPayload>({
    mutationKey: ['DELETE_PAYMENT'],
    mutationFn: ({ paymentId }: IDeletePaymentPayload) =>
      Http.delete(`/payments/${paymentId}`).then((r) => r.data),
    onSuccess: () => {
      showSuccess({
        title: 'Pago eliminado',
        description: 'El pago fue eliminado correctamente.',
      });
      invalidatePayments();
    },
    onError: (error: AxiosResponseError) => showError(error),
  });
}
