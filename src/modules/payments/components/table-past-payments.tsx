import { Table, Button, Tag, Spin } from 'antd';
import {
  LuHistory,
  LuCreditCard,
  LuRefreshCw,
  LuCircleAlert,
  LuExternalLink,
} from 'react-icons/lu';
import { useGetPayments } from '../hooks/use-get-payments';
import type { IPayment } from '@/interfaces';
import { PaymentStatus, BlockchainNetwork } from '@/enums';

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

function getExplorerUrl(network: string, txid: string): string {
  if (network === BlockchainNetwork.TRC20) {
    return `https://tronscan.org/#/transaction/${txid}`;
  }
  if (network === BlockchainNetwork.BEP20) {
    return `https://bscscan.com/tx/${txid}`;
  }
  return '#';
}

export function TablePastPayments() {
  const { payments, isLoading, isError, error, nextCursor, invalidatePayments } = useGetPayments({
    status: PaymentStatus.Completed,
    limit: 20,
  });

  const columns = [
    {
      title: 'Usuario',
      key: 'user',
      render: (_: unknown, record: IPayment) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
            <LuCreditCard size={16} />
          </div>
          <span className="font-bold text-gray-700">{formatUserName(record)}</span>
        </div>
      ),
    },
    {
      title: 'Wallet',
      key: 'wallet',
      render: (_: unknown, record: IPayment) => (
        <div className="text-sm text-gray-500">
          <span className="font-medium text-gray-600">{record.network}</span>
          <span className="mx-1">·</span>
          <span className="font-mono text-xs">
            {record.walletAddress.slice(0, 12)}...{record.walletAddress.slice(-8)}
          </span>
        </div>
      ),
    },
    {
      title: 'Monto recibido',
      key: 'amount',
      render: (_: unknown, record: IPayment) => (
        <span className="font-semibold text-green-600">{record.amountReceived} USDT</span>
      ),
    },
    {
      title: 'Fecha de pago',
      key: 'paidAt',
      render: (_: unknown, record: IPayment) => formatDate(record.paidAt),
    },
    {
      title: 'Transacción',
      key: 'txid',
      render: (_: unknown, record: IPayment) => {
        if (!record.txid) return <span className="text-gray-400 text-sm">--</span>;
        return (
          <a
            href={getExplorerUrl(record.network, record.txid)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            <span className="font-mono">
              {record.txid.slice(0, 10)}...{record.txid.slice(-6)}
            </span>
            <LuExternalLink size={14} />
          </a>
        );
      },
    },
    {
      title: 'Estado',
      key: 'status',
      render: () => (
        <Tag color="green" className="rounded-full px-3 py-0 border-none font-medium">
          Completado
        </Tag>
      ),
    },
  ];

  if (isLoading) {
    return (
      <section className="mt-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-12 flex flex-col items-center justify-center gap-4">
          <Spin size="large" />
          <p className="text-gray-400 animate-pulse font-medium">Cargando historial de pagos...</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mt-8">
        <div className="bg-white rounded-2xl border border-red-100 p-12 flex flex-col items-center justify-center gap-3 text-red-500">
          <LuCircleAlert className="text-[40px]" />
          <p className="text-base font-medium">Error al cargar el historial</p>
          <p className="text-sm text-red-400 max-w-md text-center">
            {error.response?.data?.message || error.message || 'Ocurrió un error inesperado'}
          </p>
          <Button
            type="primary"
            onClick={() => invalidatePayments()}
            className="mt-2 rounded-lg bg-indigo-500! border-indigo-500!"
            icon={<LuRefreshCw size={16} />}
          >
            Reintentar
          </Button>
        </div>
      </section>
    );
  }

  if (payments.length === 0) {
    return (
      <section className="mt-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-12 flex flex-col items-center justify-center gap-3 text-gray-400">
          <LuHistory className="text-4xl" />
          <p className="text-base">No hay pagos completados</p>
          <p className="text-sm">
            Los pagos aparecerán aquí una vez que sean confirmados en blockchain
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
            <LuHistory size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Historial de Pagos</h2>
            <p className="text-sm text-gray-400">Pagos confirmados en blockchain</p>
          </div>
        </div>

        <Table columns={columns} dataSource={payments} rowKey="id" pagination={false} />

        {nextCursor && (
          <div className="flex justify-center pt-4 border-t border-gray-100 mt-4">
            <Button type="text" className="text-gray-500 hover:text-indigo-600">
              Cargar más
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
