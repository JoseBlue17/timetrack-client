import { Select } from 'antd';
import { PaymentStatus } from '@/enums';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: PaymentStatus.Pending, label: 'Pendiente' },
  { value: PaymentStatus.Failed, label: 'Fallido' },
  { value: PaymentStatus.Expired, label: 'Expirado' },
];

interface PaymentStatusFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function PaymentStatusFilter({ value, onChange }: PaymentStatusFilterProps) {
  return (
    <Select
      value={value}
      onChange={onChange}
      options={STATUS_OPTIONS}
      className="w-40"
      placeholder="Filtrar por estado"
    />
  );
}
