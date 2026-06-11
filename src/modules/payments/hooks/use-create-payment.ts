import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { useShowError, useShowSuccess } from '@/hooks';
import type { AxiosResponseError } from '@/config/http';

export interface ICreatePaymentPayload {
  reportId: string;
  walletId: string;
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();

  return useMutation<unknown, AxiosResponseError, ICreatePaymentPayload>({
    mutationKey: ['CREATE_PAYMENT'],
    mutationFn: ({ reportId, walletId }: ICreatePaymentPayload) =>
      Http.post('/payments', { reportId, walletId }).then((r) => r.data),
    onSuccess: () => {
      showSuccess({
        title: 'Pago creado',
        description: 'El pago ha sido creado correctamente.',
      });
      queryClient.invalidateQueries({ queryKey: ['PAYMENTS'] });
      queryClient.invalidateQueries({ queryKey: ['REPORTS_LIST'] });
    },
    onError: (error: AxiosResponseError) => showError(error),
  });
}
