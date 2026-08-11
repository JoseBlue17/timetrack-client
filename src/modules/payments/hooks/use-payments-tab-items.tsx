import { MdOutlineHistoryEdu, MdOutlinePayments } from 'react-icons/md';
import { PaymentsTable } from '../components/payments-table';
import { TablePastPayments } from '../components/table-past-payments';
import type { TabsProps } from 'antd';

export function usePaymentsTabItems(): TabsProps['items'] {
  return [
    {
      key: 'registros',
      label: (
        <span className="flex items-center gap-2">
          <MdOutlinePayments size={16} />
          Registros de pagos
        </span>
      ),
      children: <PaymentsTable />,
    },
    {
      key: 'historial',
      label: (
        <span className="flex items-center gap-2">
          <MdOutlineHistoryEdu size={16} />
          Historial de pagos
        </span>
      ),
      children: <TablePastPayments />,
    },
  ];
}
