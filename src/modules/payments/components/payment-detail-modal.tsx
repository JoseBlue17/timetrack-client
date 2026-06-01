import { Modal, Tag, Button } from 'antd';
import { LuCopy, LuCircleCheck, LuClock, LuCircleX, LuCircleAlert } from 'react-icons/lu';
import type { IPaymentDetailModalProps } from './payments.interface';
import { PaymentStatus } from '@/enums';
import { useVerifyPayment } from '../hooks/use-verify-payment';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  [PaymentStatus.Pending]: { label: 'Pendiente', color: 'gold', icon: <LuClock size={18} /> },
  [PaymentStatus.Completed]: {
    label: 'Completado',
    color: 'green',
    icon: <LuCircleCheck size={18} />,
  },
  [PaymentStatus.Failed]: { label: 'Fallido', color: 'red', icon: <LuCircleX size={18} /> },
  [PaymentStatus.Expired]: {
    label: 'Expirado',
    color: 'default',
    icon: <LuCircleAlert size={18} />,
  },
};

export function PaymentDetailModal({ open, onClose, payment }: IPaymentDetailModalProps) {
  const { mutate: verifyPayment, isPending: isVerifying } = useVerifyPayment();

  if (!payment) return null;

  const status = STATUS_CONFIG[payment.status] ?? STATUS_CONFIG[PaymentStatus.Pending];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

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
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm">Estado</span>
          <Tag
            color={status.color}
            className="rounded-full px-3 py-0.5 border-none font-medium flex items-center gap-1"
          >
            {status.icon}
            {status.label}
          </Tag>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm">Red</span>
          <span className="font-medium text-gray-800">{payment.network}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm">Monto esperado</span>
          <span className="font-medium text-gray-800">{payment.amountExpected} USDT</span>
        </div>

        {payment.amountReceived > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">Monto recibido</span>
            <span className="font-medium text-green-600">{payment.amountReceived} USDT</span>
          </div>
        )}

        <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2">
          <span className="text-gray-500 text-sm">Dirección de wallet</span>
          <div className="flex items-center gap-2">
            <code className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 break-all flex-1">
              {payment.walletAddress}
            </code>
            <Button
              type="text"
              icon={<LuCopy size={16} />}
              onClick={() => handleCopy(payment.walletAddress)}
              className="shrink-0"
            />
          </div>
        </div>

        {payment.txid && (
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 text-sm">Hash de transacción (TXID)</span>
            <code className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 break-all">
              {payment.txid}
            </code>
          </div>
        )}

        {payment.status === PaymentStatus.Pending && (
          <Button
            type="primary"
            loading={isVerifying}
            onClick={() => verifyPayment({ paymentId: payment.id })}
            className="rounded-lg! bg-indigo-500! border-indigo-500! hover:bg-indigo-600! hover:border-indigo-600! mt-2"
          >
            Verificar en blockchain
          </Button>
        )}
      </div>
    </Modal>
  );
}
