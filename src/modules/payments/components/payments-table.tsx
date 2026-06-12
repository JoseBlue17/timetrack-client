import { useState } from 'react';
import { Button, Tag, Spin, Popconfirm, Select } from 'antd';
import {
  LuEye,
  LuTrash2,
  LuRefreshCw,
  LuCreditCard,
  LuChevronDown,
  LuCircleAlert,
  LuExternalLink,
} from 'react-icons/lu';
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

function formatUserName(payment: IPayment): string {
  const first = payment.firstName ?? '';
  const last = payment.lastName ?? '';
  const full = `${first} ${last}`.trim();
  return full || 'Usuario';
}

function formatDate(date?: Date | string): string {
  if (!date) return '--';
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function PaymentsTable() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<IPayment | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const isAdmin = useCanEditConfiguration();
  const { payments, isLoading, isError, error, nextCursor, invalidatePayments } = useGetPayments({
    status: statusFilter || undefined,
    excludeStatus: statusFilter ? undefined : PaymentStatus.Completed,
  });
  const { mutate: deletePayment, isPending: isDeleting } = useDeletePayment();
  const { mutate: verifyPayment, isPending: isVerifying } = useVerifyPayment();

  const openDetail = (payment: IPayment) => {
    setSelectedPayment(payment);
    setDetailOpen(true);
  };

  const canDelete = (payment: IPayment) => {
    return isAdmin && payment.status !== PaymentStatus.Completed;
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

      {isError ? (
        <div className="flex flex-col items-center justify-center py-16 text-red-500 bg-white rounded-2xl border border-red-100">
          <LuCircleAlert className="text-[40px] mb-3" />
          <p className="text-base font-medium">Error al cargar pagos</p>
          <p className="text-sm mt-1 text-red-400 max-w-md text-center px-4">
            {error.response?.data?.message || error.message || 'Ocurrió un error inesperado'}
          </p>
          <Button
            type="primary"
            onClick={() => invalidatePayments()}
            className="mt-4 rounded-lg bg-indigo-500! border-indigo-500!"
          >
            Reintentar
          </Button>
        </div>
      ) : isLoading ? (
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-800 text-sm">{formatUserName(payment)}</p>
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
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-600">
                      Esperado: <span className="font-medium">{payment.amountExpected} USDT</span>
                    </span>
                    {payment.status === PaymentStatus.Completed && (
                      <span className="text-xs text-green-600">
                        Recibido: <span className="font-medium">{payment.amountReceived} USDT</span>
                      </span>
                    )}
                    {payment.status === PaymentStatus.Pending && (
                      <span className="text-xs text-gray-400">
                        Vence: {formatDate(payment.expiresAt)}
                      </span>
                    )}
                    {payment.txid && (
                      <span className="text-xs text-gray-400 font-mono">
                        TX: {payment.txid.slice(0, 12)}...
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    type="text"
                    icon={<LuEye className="text-gray-400" />}
                    onClick={() => openDetail(payment)}
                  />

                  {payment.status === PaymentStatus.Pending && isAdmin && (
                    <>
                      <Button
                        type="text"
                        icon={<LuExternalLink className="text-amber-500" />}
                        onClick={() =>
                          window.open(
                            'https://www.binance.com/es-LA/my/wallet/account/withdrawal',
                            '_blank',
                          )
                        }
                        title="Abrir Binance para pagar"
                      />
                      <Button
                        type="text"
                        icon={<LuRefreshCw className="text-gray-400" />}
                        loading={isVerifying}
                        onClick={() => verifyPayment({ paymentId: payment.id })}
                        title="Verificar en blockchain"
                      />
                    </>
                  )}

                  {canDelete(payment) && (
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

          {nextCursor && (
            <div className="flex justify-center py-3 border-t border-gray-100">
              <Button type="text" icon={<LuChevronDown size={16} />} className="text-gray-500">
                Cargar más
              </Button>
            </div>
          )}
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
