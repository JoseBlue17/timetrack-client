import { Button, DatePicker } from 'antd';
import { LuPlus, LuClipboardCheck } from 'react-icons/lu';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

interface ITimesheetsActiveHeaderProps {
  totalHours: number;
  selectedDate: Dayjs;
  onDateChange: (date: Dayjs) => void;
  isClosingMonth: boolean;
  onCloseMonth: () => void;
  onAdd: () => void;
}

export function TimesheetsActiveHeader({
  totalHours,
  selectedDate,
  onDateChange,
  isClosingMonth,
  onCloseMonth,
  onAdd,
}: ITimesheetsActiveHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">
          Total de horas este mes ({dayjs().format('MMMM')})
        </p>
        <h2 className="text-3xl font-bold text-gray-800">{totalHours}h</h2>
      </div>

      <div className="flex items-center gap-3">
        <DatePicker
          picker="month"
          value={selectedDate}
          onChange={(date) => date && onDateChange(date)}
          className="rounded-xl border-gray-200 w-36"
        />

        <Button
          icon={<LuClipboardCheck className="text-indigo-500" />}
          loading={isClosingMonth}
          onClick={onCloseMonth}
        >
          Cerrar mes y generar reporte
        </Button>
        <Button
          type="primary"
          icon={<LuPlus />}
          onClick={onAdd}
          className="shadow-md shadow-indigo-200"
        >
          Agregar registro
        </Button>
      </div>
    </div>
  );
}
