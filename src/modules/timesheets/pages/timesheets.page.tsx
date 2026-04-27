import { useMemo, useState } from 'react';
import { Button, Input } from 'antd';
import { LuBell, LuFilter, LuPlus, LuClipboardCheck, LuClock } from 'react-icons/lu';
import { useGetTimesheets } from '../hooks/use-get-timesheets';
import { TimesheetsTable } from '../components/timesheets-table';
import { TimesheetFormModal } from '../components/timesheet-form-modal';
import { CloseMonthModal } from '../components/close-month-modal';
import type { ITimesheet, ITimesheetDateGroup } from '../components/timesheet.interface';

export function TimesheetsPage() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [closeMonthModalOpen, setCloseMonthModalOpen] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<ITimesheet | undefined>(undefined);

  const { data, isLoading } = useGetTimesheets({ search });

  const timesheets = useMemo(() => data?.timesheets ?? [], [data?.timesheets]);

  const totalHours = useMemo(() => {
    return timesheets.reduce((total, timesheet) => total + timesheet.hours, 0);
  }, [timesheets]);

  const uniqueDays = useMemo(() => {
    return new Set(timesheets.map((t) => t.date.slice(0, 10))).size;
  }, [timesheets]);

  const groups = useMemo<ITimesheetDateGroup[]>(() => {
    const timesheetsByDate = timesheets.reduce<Map<string, ITimesheet[]>>(
      (accumulator, timesheet) => {
        const dateKey = timesheet.date.slice(0, 10);
        const existingList = accumulator.get(dateKey) ?? [];
        accumulator.set(dateKey, [...existingList, timesheet]);
        return accumulator;
      },
      new Map<string, ITimesheet[]>(),
    );

    return Array.from(timesheetsByDate.entries())
      .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
      .map(([date, items]) => {
        const uniqueProjectsCount = new Set(items.map((item) => item.project)).size;
        const totalHoursForDate = items.reduce(
          (totalForDate, item) => totalForDate + item.hours,
          0,
        );

        return {
          date,
          projects: uniqueProjectsCount,
          totalHours: totalHoursForDate,
          timesheets: items,
        };
      });
  }, [timesheets]);

  const handleEdit = (timesheet: ITimesheet) => {
    setSelectedTimesheet(timesheet);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedTimesheet(undefined);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedTimesheet(undefined);
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800">Timesheets</h1>
        <div className="flex items-center gap-4">
          <Input.Search
            placeholder="Buscar..."
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-60"
          />
          <Button shape="circle" icon={<LuBell />} />
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8 bg-stone-100">
        <div className="mb-4 text-gray-600 font-medium">
          Total de horas registradas:{' '}
          <span className="text-indigo-600 font-bold">{totalHours}h</span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Button icon={<LuFilter />}>Filtrar</Button>
          <Button icon={<LuClock className="text-gray-400" />}>Esta semana</Button>
          <Button
            icon={<LuClipboardCheck className="text-indigo-500" />}
            onClick={() => setCloseMonthModalOpen(true)}
            className="ml-auto! border-gray-300!"
          >
            Cerrar mes y generar reporte
          </Button>
          <Button
            type="primary"
            icon={<LuPlus />}
            onClick={handleAdd}
            className="bg-indigo-500! border-indigo-500! hover:bg-indigo-600! hover:border-indigo-600!"
          >
            Agregar registro
          </Button>
        </div>

        <TimesheetsTable groups={groups} loading={isLoading} onEdit={handleEdit} />
      </main>

      {modalOpen && (
        <TimesheetFormModal open={modalOpen} onClose={handleClose} timesheet={selectedTimesheet} />
      )}

      {closeMonthModalOpen && (
        <CloseMonthModal
          isModalOpen={closeMonthModalOpen}
          handleCloseModal={() => setCloseMonthModalOpen(false)}
          totalLocalDays={uniqueDays}
          totalLocalHours={totalHours}
        />
      )}
    </div>
  );
}
