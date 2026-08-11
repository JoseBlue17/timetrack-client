import { InputNumber } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import { useHourlyRate } from '@/hooks';

export function HourlyRateSection() {
  const { hourlyRate, setHourlyRate } = useHourlyRate();

  return (
    <section className="mb-4 mt-4 bg-white p-6 rounded-2xl border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-1">
        <DollarOutlined className="text-green-500! mr-2" />
        Costo por hora ($)
      </h3>

      <p className="text-sm text-gray-500 mb-3">
        Este valor se usará por defecto al registrar tus horas en tus timesheets.
        <div className="border-b border-gray-200 mt-2"></div>
      </p>

      <InputNumber
        className="w-full max-w-xs"
        placeholder="0.00"
        min={0}
        precision={2}
        prefix="$"
        value={hourlyRate}
        onChange={setHourlyRate}
      />
    </section>
  );
}
