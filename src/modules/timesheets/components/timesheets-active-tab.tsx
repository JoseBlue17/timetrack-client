import { Spin } from 'antd';
import { LuClock } from 'react-icons/lu';
import type { Dayjs } from 'dayjs';
import type { ITimesheet, ITimesheetDateGroup } from './timesheet.interface';
import { TimesheetsTable } from './timesheets-table';
import { TimesheetsActiveHeader } from './timesheets-active-header';
import { LoadingOutlined } from '@ant-design/icons';

interface ITimesheetsActiveTabProps {
  timesheets: ITimesheet[];
  groups: ITimesheetDateGroup[];
  totalHours: number;
  selectedDate: Dayjs;
  isLoading: boolean;
  isClosingMonth: boolean;
  isFetchingNextPage: boolean;
  observerTarget: React.RefObject<HTMLDivElement | null>;
  onDateChange: (date: Dayjs) => void;
  onCloseMonth: () => void;
  onAdd: () => void;
  onEdit: (timesheet: ITimesheet) => void;
}

export function TimesheetsActiveTab({
  timesheets,
  groups,
  totalHours,
  selectedDate,
  isLoading,
  isClosingMonth,
  isFetchingNextPage,
  observerTarget,
  onDateChange,
  onCloseMonth,
  onAdd,
  onEdit,
}: ITimesheetsActiveTabProps) {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <TimesheetsActiveHeader
        totalHours={totalHours}
        selectedDate={selectedDate}
        onDateChange={onDateChange}
        isClosingMonth={isClosingMonth}
        onCloseMonth={onCloseMonth}
        onAdd={onAdd}
      />

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mt-2 px-4 pb-4">
        {timesheets.length > 0 ? (
          <TimesheetsTable groups={groups} loading={isLoading} onEdit={onEdit} />
        ) : (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300">
              <LuClock size={32} />
            </div>
            <div>
              <p className="text-gray-800 font-bold">No hay registros este mes</p>
              <p className="text-gray-400 text-sm">
                Comienza a trackear tus horas haciendo clic en &quot;Agregar registro&quot;
              </p>
            </div>
          </div>
        )}

        <div ref={observerTarget} className="flex justify-center py-8">
          {isFetchingNextPage ? (
            <Spin indicator={<LoadingOutlined spin />} size="large" className="text-indigo-600" />
          ) : null}
        </div>
      </div>
    </div>
  );
}
