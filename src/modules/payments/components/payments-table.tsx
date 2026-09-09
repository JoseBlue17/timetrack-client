import { Button, Tag, Popconfirm } from 'antd';
import {
  LuEye,
  LuTrash2,
  LuRefreshCw,
  LuCreditCard,
  LuCircleAlert,
  LuExternalLink,
} from 'react-icons/lu';
import { usePaymentsTable } from '../hooks/use-payments-table';
import { PaymentDetailModal } from './payment-detail-modal';
import { PaymentStatusFilter } from './payment-status-filter';
import { LoadingBox } from '@/components/loading-box';
import { EmptyState } from '@/components/empty-state';
import { formatShortDate } from '@/helpers/format-short-date';
import { formatUserName } from '@/helpers/format-user-name';
import type { IPayment } from '@/interfaces';
import { PaymentStatus } from '@/enums';
import { useCanEditConfiguration } from '@/hooks';
import { getHttpErrorMessage } from '@/config/http/error';

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
  const {
    statusFilter,
    setStatusFilter,
    payments,
    isLoading,
    isError,
    error,
    invalidatePayments,
    deletePayment,
    isDeleting,
    verifyPayment,
    isVerifying,
    selectedPayment,
    detailOpen,
    openDetail,
    closeDetail,
  } = usePaymentsTable();

  const isAdmin = useCanEditConfiguration();

  const canDelete = (payment: IPayment) => {
    return isAdmin && payment.status !== PaymentStatus.Completed;
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-4">
        <PaymentStatusFilter value={statusFilter} onChange={setStatusFilter} />

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
            {error ? getHttpErrorMessage(error) : 'Ocurrió un error inesperado'}
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
        <LoadingBox />
      ) : payments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200">
          <EmptyState
            icon={<LuCreditCard className="text-2xl" />}
            title="No hay pagos registrados"
            description="Los pagos aparecerán cuando un reporte sea aprobado"
          />
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
                        Vence: {formatShortDate(payment.expiresAt)}
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
        </div>
      )}

      <PaymentDetailModal open={detailOpen} onClose={closeDetail} payment={selectedPayment} />
    </>
  );
}
