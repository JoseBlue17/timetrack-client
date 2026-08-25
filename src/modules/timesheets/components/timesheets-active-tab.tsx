import type { Dayjs } from 'dayjs';
import { LuClock } from 'react-icons/lu';

import { EmptyState } from '@/components/empty-state';
import { LoadingBox } from '@/components/loading-box';
import type { ITimesheet, ITimesheetDateGroup } from './timesheet.interface';
import { TimesheetsActiveHeader } from './timesheets-active-header';
import { TimesheetsTable } from './timesheets-table';

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
  if (isLoading) {
    return <LoadingBox text="Cargando timesheets..." />;
  }

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

      {timesheets.length > 0 ? (
        <TimesheetsTable groups={groups} onEdit={onEdit} />
      ) : (
        <EmptyState
          icon={<LuClock size={32} />}
          title="No hay registros este mes"
          description='Comienza a trackear tus horas haciendo clic en "Agregar registro"'
        />
      )}

      <div ref={observerTarget} className="flex justify-center py-8">
        {isFetchingNextPage ? <LoadingBox text="Cargando más..." className="p-8" /> : null}
      </div>
    </div>
  );
}
