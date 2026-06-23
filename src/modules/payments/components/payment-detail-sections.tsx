import { Tag, Button } from 'antd';
import {
  LuUser,
  LuCalendar,
  LuShield,
  LuFileText,
  LuExternalLink,
  LuWallet,
  LuCoins,
  LuNetwork,
  LuCopy,
  LuCircleCheck,
  LuClock,
  LuCircleX,
  LuCircleAlert,
} from 'react-icons/lu';
import type { IPayment } from '@/interfaces';
import { PaymentStatus } from '@/enums';
import {
  formatDate,
  formatUserName,
  copyToClipboard,
  copyPaymentDetails,
  openBinanceWithdrawal,
} from './payment-detail.utils';

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

interface IPaymentInfoRowProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}

export function PaymentStatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG[PaymentStatus.Pending];

  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500 text-sm">Estado</span>
      <Tag
        color={config.color}
        className="rounded-full px-3 py-0.5 border-none font-medium flex items-center gap-1"
      >
        {config.icon}
        {config.label}
      </Tag>
    </div>
  );
}

function PaymentInfoRow({ label, value, icon }: IPaymentInfoRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500 text-sm flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}

export function PaymentAmountRow({ payment }: { payment: IPayment }) {
  return (
    <>
      {payment.amountReceived > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm">Monto recibido</span>
          <span className="font-medium text-green-600">{payment.amountReceived} USDT</span>
        </div>
      )}
    </>
  );
}

export function PaymentConfirmationsRow({ payment }: { payment: IPayment }) {
  if (payment.status !== PaymentStatus.Pending) return null;

  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500 text-sm flex items-center gap-1.5">
        <LuShield size={14} />
        Confirmaciones
      </span>
      <span className="font-medium text-gray-800">{payment.confirmations}</span>
    </div>
  );
}

export function PaymentBinanceCard({ payment }: { payment: IPayment }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-amber-800 font-semibold text-sm">
        <LuWallet size={16} />
        Datos para el pago en Binance
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg p-3 border border-amber-100">
          <span className="text-gray-400 text-xs flex items-center gap-1">
            <LuCoins size={12} />
            Monto a enviar
          </span>
          <p className="text-lg font-bold text-gray-800 mt-0.5">{payment.amountExpected} USDT</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-amber-100">
          <span className="text-gray-400 text-xs flex items-center gap-1">
            <LuNetwork size={12} />
            Red blockchain
          </span>
          <p className="text-lg font-bold text-gray-800 mt-0.5">{payment.network}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-3 border border-amber-100">
        <span className="text-gray-400 text-xs">Dirección de wallet del empleado</span>
        <div className="flex items-center gap-2 mt-1">
          <code className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 break-all flex-1">
            {payment.walletAddress}
          </code>
          <Button
            type="text"
            icon={<LuCopy size={16} />}
            onClick={() => copyToClipboard(payment.walletAddress)}
            className="shrink-0"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="primary"
          icon={<LuExternalLink size={16} />}
          onClick={openBinanceWithdrawal}
          className="rounded-lg! flex-1 bg-amber-500! border-amber-500! hover:bg-amber-600! hover:border-amber-600!"
        >
          Abrir Binance
        </Button>
        <Button
          icon={<LuCopy size={16} />}
          onClick={() => copyPaymentDetails(payment)}
          className="rounded-lg! border-amber-300 text-amber-700 hover:text-amber-800 hover:border-amber-400"
        >
          Copiar datos
        </Button>
      </div>

      <p className="text-xs text-amber-700">
        El jefe debe realizar el pago manualmente en Binance. El sistema detectará automáticamente
        la transferencia.
      </p>
    </div>
  );
}

export function PaymentWalletCard({ payment }: { payment: IPayment }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2">
      <span className="text-gray-500 text-sm">Dirección de wallet</span>
      <div className="flex items-center gap-2">
        <code className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 break-all flex-1">
          {payment.walletAddress}
        </code>
        <Button
          type="text"
          icon={<LuCopy size={16} />}
          onClick={() => copyToClipboard(payment.walletAddress)}
          className="shrink-0"
        />
      </div>
    </div>
  );
}

export function PaymentTxidCard({ payment }: { payment: IPayment }) {
  if (!payment.txid) return null;

  return (
    <div className="bg-green-50 rounded-xl p-4 flex flex-col gap-2">
      <span className="text-green-700 text-sm font-medium">Hash de transacción (TXID)</span>
      <div className="flex items-center gap-2">
        <code className="text-xs bg-white border border-green-200 rounded-lg px-3 py-2 break-all flex-1 text-green-800">
          {payment.txid}
        </code>
        <Button
          type="text"
          icon={<LuCopy size={16} />}
          onClick={() => copyToClipboard(payment.txid)}
          className="shrink-0 text-green-700"
        />
      </div>
    </div>
  );
}

export function PaymentDatesGrid({ payment }: { payment: IPayment }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-gray-50 rounded-xl p-3">
        <span className="text-gray-400 text-xs flex items-center gap-1">
          <LuCalendar size={12} />
          Creado
        </span>
        <p className="text-sm font-medium text-gray-700 mt-0.5">{formatDate(payment.createdAt)}</p>
      </div>

      {payment.paidAt && (
        <div className="bg-green-50 rounded-xl p-3">
          <span className="text-green-600 text-xs flex items-center gap-1">
            <LuCircleCheck size={12} />
            Pagado
          </span>
          <p className="text-sm font-medium text-green-700 mt-0.5">{formatDate(payment.paidAt)}</p>
        </div>
      )}

      {!payment.paidAt && payment.expiresAt && (
        <div className="bg-gray-50 rounded-xl p-3">
          <span className="text-gray-400 text-xs flex items-center gap-1">
            <LuCalendar size={12} />
            Vence
          </span>
          <p className="text-sm font-medium text-gray-700 mt-0.5">
            {formatDate(payment.expiresAt)}
          </p>
        </div>
      )}

      {payment.detectedAt && (
        <div className="bg-gray-50 rounded-xl p-3">
          <span className="text-gray-400 text-xs flex items-center gap-1">
            <LuShield size={12} />
            Detectado
          </span>
          <p className="text-sm font-medium text-gray-700 mt-0.5">
            {formatDate(payment.detectedAt)}
          </p>
        </div>
      )}
    </div>
  );
}

export function PaymentAdminActions({
  payment,
  isVerifying,
  onVerify,
}: {
  payment: IPayment;
  isVerifying: boolean;
  onVerify: (payload: { paymentId: string }) => void;
}) {
  return (
    <div className="flex flex-col gap-2 mt-2">
      <Button
        type="primary"
        loading={isVerifying}
        onClick={() => onVerify({ paymentId: payment.id })}
        className="rounded-lg! bg-indigo-500! border-indigo-500! hover:bg-indigo-600! hover:border-indigo-600!"
      >
        Verificar en blockchain
      </Button>
    </div>
  );
}

export function PaymentEmployeeRow({ payment }: { payment: IPayment }) {
  return (
    <PaymentInfoRow label="Empleado" value={formatUserName(payment)} icon={<LuUser size={14} />} />
  );
}

export function PaymentReportRow({ payment }: { payment: IPayment }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500 text-sm flex items-center gap-1.5">
        <LuFileText size={14} />
        Reporte ID
      </span>
      <code className="text-xs text-gray-600 font-mono">{payment.reportId}</code>
    </div>
  );
}
