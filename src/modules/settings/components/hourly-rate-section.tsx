import { Button, InputNumber } from 'antd';
import { DollarOutlined, SaveOutlined } from '@ant-design/icons';
import { useHourlyRateDraft } from '../hooks/use-hourly-rate-draft';

export function HourlyRateSection() {
  const { pendingHourlyRate, setPendingHourlyRate, hasChanges, isSaving, onSave } =
    useHourlyRateDraft();

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

      <div className="flex justify-between items-start">
        <InputNumber
          className="w-full max-w-xs"
          placeholder="0.00"
          min={0}
          precision={2}
          prefix="$"
          value={pendingHourlyRate}
          onChange={setPendingHourlyRate}
        />

        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={onSave}
          disabled={!hasChanges}
          loading={isSaving}
          className="font-semibold"
        >
          Guardar cambios
        </Button>
      </div>
    </section>
  );
}
