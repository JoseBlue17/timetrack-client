import type { IPayment } from '@/interfaces';

export interface IPaymentDetailModalProps {
  open: boolean;
  onClose: () => void;
  payment: IPayment | null;
}
