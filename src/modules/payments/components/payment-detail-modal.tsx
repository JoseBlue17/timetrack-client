import { Modal } from 'antd';
import type { IPaymentDetailModalProps } from './payments.interface';
import { PaymentStatus } from '@/enums';
import { useVerifyPayment } from '../hooks/use-verify-payment';
import { useCanEditConfiguration } from '@/hooks';
import {
  PaymentStatusBadge,
  PaymentEmployeeRow,
  PaymentNetworkRow,
  PaymentAmountRow,
  PaymentConfirmationsRow,
  PaymentBinanceCard,
  PaymentWalletCard,
  PaymentTxidCard,
  PaymentDatesGrid,
  PaymentReportRow,
  PaymentAdminActions,
} from './payment-detail-sections';

export function PaymentDetailModal({ open, onClose, payment }: IPaymentDetailModalProps) {
  const { mutate: verifyPayment, isPending: isVerifying } = useVerifyPayment();
  const isAdmin = useCanEditConfiguration();

  if (!payment) return null;

  const showBinanceCard = payment.status === PaymentStatus.Pending && isAdmin;
  const showWalletCard = payment.status !== PaymentStatus.Pending || !isAdmin;
  const showAdminActions = payment.status === PaymentStatus.Pending && isAdmin;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={560}
      title={<span className="text-lg font-bold text-gray-800">Detalle del pago</span>}
    >
      <div className="flex flex-col gap-4 py-2">
        <PaymentStatusBadge status={payment.status} />
        <PaymentEmployeeRow payment={payment} />
        <PaymentNetworkRow payment={payment} />
        <PaymentAmountRow payment={payment} />
        <PaymentConfirmationsRow payment={payment} />
        {showBinanceCard && <PaymentBinanceCard payment={payment} />}
        {showWalletCard && <PaymentWalletCard payment={payment} />}
        <PaymentTxidCard payment={payment} />
        <PaymentDatesGrid payment={payment} />
        <PaymentReportRow payment={payment} />
        {showAdminActions && (
          <PaymentAdminActions
            payment={payment}
            isVerifying={isVerifying}
            onVerify={verifyPayment}
          />
        )}
      </div>
    </Modal>
  );
}
