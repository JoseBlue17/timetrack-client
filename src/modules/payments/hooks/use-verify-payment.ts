import { useMutation } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { useShowError, useShowSuccess } from '@/hooks';
import type { AxiosResponseError } from '@/config/http';
import { useGetPayments } from './use-get-payments';

export interface IVerifyPaymentPayload {
  paymentId: string;
}

export interface IVerifyPaymentResponse {
  verified: boolean;
  txid?: string;
  amount?: number;
}

export function useVerifyPayment() {
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();
  const { invalidatePayments } = useGetPayments();

  return useMutation<IVerifyPaymentResponse, AxiosResponseError, IVerifyPaymentPayload>({
    mutationKey: ['VERIFY_PAYMENT'],
    mutationFn: ({ paymentId }: IVerifyPaymentPayload) =>
      Http.post(`/payments/${paymentId}/verify`).then((r) => r.data),
    onSuccess: (data) => {
      if (data.verified) {
        showSuccess({
          title: 'Pago verificado',
          description: `Transacción detectada: ${data.txid?.slice(0, 16)}...`,
        });
      } else {
        showSuccess({
          title: 'Verificación completada',
          description: 'No se encontró una transacción coincidente en blockchain.',
        });
      }
      invalidatePayments();
    },
    onError: (error: AxiosResponseError) => showError(error),
  });
}
