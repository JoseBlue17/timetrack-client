import { Card, List, Tag } from 'antd';
import { LuCreditCard } from 'react-icons/lu';

import { EmptyState } from '@/components/empty-state';

import type { IDashboardPayment } from './dashboard.interface';
import { formatDate } from '@/helpers/format-date';
import { formatUsdt } from '@/helpers/format-usdt';
import {
  getPaymentAmount,
  getPaymentStatusColor,
  getPaymentStatusLabel,
} from '@/helpers/payment-status';
import { shortenTxid } from '@/helpers/shorten-txid';

interface PaymentHistoryListProps {
  payments?: IDashboardPayment[];
}

export function PaymentHistoryList({ payments = [] }: PaymentHistoryListProps) {
  return (
    <Card title="Historial de pagos" className="border-gray-200 shadow-sm">
      {payments.length > 0 ? (
        <List
          dataSource={payments}
          split
          renderItem={(payment) => (
            <List.Item
              actions={[
                <Tag key="status" color={getPaymentStatusColor(payment.status)}>
                  {getPaymentStatusLabel(payment.status)}
                </Tag>,
              ]}
            >
              <List.Item.Meta
                title={
                  <span className="text-base font-medium">
                    {formatDate(payment.paidAt ?? payment.createdAt)}
                  </span>
                }
                description={<span className="text-slate-500">{shortenTxid(payment.txid)}</span>}
              />
              <span className="font-medium text-slate-950">
                {formatUsdt(getPaymentAmount(payment))}
              </span>
            </List.Item>
          )}
        />
      ) : (
        <EmptyState
          icon={<LuCreditCard size={32} />}
          title="Sin pagos registrados"
          description="Los pagos aparecerán cuando un reporte sea aprobado y pagado."
          className="py-12"
        />
      )}
    </Card>
  );
}
