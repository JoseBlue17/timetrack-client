import { useState } from 'react';
import { Button, Tag, Spin, Popconfirm, Select } from 'antd';
import { LuEye, LuTrash2, LuRefreshCw, LuCreditCard } from 'react-icons/lu';
import { useGetPayments } from '../hooks/use-get-payments';
import { useDeletePayment } from '../hooks/use-delete-payment';
import { useVerifyPayment } from '../hooks/use-verify-payment';
import { PaymentDetailModal } from './payment-detail-modal';
import type { IPayment } from '@/interfaces';
import { PaymentStatus } from '@/enums';
import { useCanEditConfiguration } from '@/hooks';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: PaymentStatus.Pending, label: 'Pendiente' },
  { value: PaymentStatus.Completed, label: 'Completado' },
  { value: PaymentStatus.Failed, label: 'Fallido' },
  { value: PaymentStatus.Expired, label: 'Expirado' },
];

const STATUS_COLORS: Record<string, string> = {
  [PaymentStatus.Pending]: 'gold',
  [PaymentStatus.Completed]: 'green',
  [PaymentStatus.Failed]: 'red',
  [PaymentStatus.Expired]: 'default',
};

const STATUS_LABELS: Record<string, string> = {
  [PaymentStatus.Pending]: 'Pendiente',
  [PaymentStatus.Completed]: 'Completado',
  [PaymentStatus.Failed]: 'Fallido',
  [PaymentStatus.Expired]: 'Expirado',
};

export function PaymentsTable() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<IPayment | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const isAdmin = useCanEditConfiguration();
  const { payments, isLoading, invalidatePayments } = useGetPayments({
    status: statusFilter || undefined,
  });
  const { mutate: deletePayment, isPending: isDeleting } = useDeletePayment();
  const { mutate: verifyPayment, isPending: isVerifying } = useVerifyPayment();

  const openDetail = (payment: IPayment) => {
    setSelectedPayment(payment);
    setDetailOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-4">
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          options={STATUS_OPTIONS}
          className="w-40"
          placeholder="Filtrar por estado"
        />

        {isAdmin && (
          <Button
            icon={<LuRefreshCw size={16} />}
            onClick={() => invalidatePayments()}
            className="rounded-lg border-gray-200 text-gray-600"
          >
            Actualizar
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      ) : payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-200">
          <LuCreditCard className="text-[40px] mb-3" />
          <p className="text-base">No hay pagos registrados</p>
          <p className="text-sm mt-1">Los pagos aparecerán cuando un reporte sea aprobado</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {payments.map((payment, index) => (
            <div
              key={payment.id}
              className={index < payments.length - 1 ? 'border-b border-gray-100' : ''}
            >
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <LuCreditCard className="text-indigo-500 text-[18px]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800 text-sm">
                      {payment.amountExpected} USDT
                    </p>
                    <Tag
                      color={STATUS_COLORS[payment.status] ?? 'default'}
                      className="rounded-full px-2 py-0 text-xs border-none"
                    >
                      {STATUS_LABELS[payment.status] ?? payment.status}
                    </Tag>
                  </div>
                  <p className="text-gray-400 text-xs truncate">
                    {payment.network} · {payment.walletAddress.slice(0, 12)}...
                    {payment.walletAddress.slice(-8)}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    type="text"
                    icon={<LuEye className="text-gray-400" />}
                    onClick={() => openDetail(payment)}
                  />

                  {payment.status === PaymentStatus.Pending && isAdmin && (
                    <Button
                      type="text"
                      icon={<LuRefreshCw className="text-gray-400" />}
                      loading={isVerifying}
                      onClick={() => verifyPayment({ paymentId: payment.id })}
                    />
                  )}

                  {isAdmin && (
                    <Popconfirm
                      title="¿Eliminar este pago?"
                      description="Esta acción no se puede deshacer."
                      onConfirm={() => deletePayment({ paymentId: payment.id })}
                      okText="Sí"
                      cancelText="No"
                    >
                      <Button
                        type="text"
                        icon={<LuTrash2 className="text-gray-400 hover:text-red-500" />}
                        loading={isDeleting}
                      />
                    </Popconfirm>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <PaymentDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        payment={selectedPayment}
      />
    </>
  );
}
