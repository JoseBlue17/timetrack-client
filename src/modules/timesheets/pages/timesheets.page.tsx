import { useMemo, useState, useRef } from 'react';
import { Button, Input, Spin } from 'antd';
import { LuBell, LuFilter, LuPlus, LuClipboardCheck, LuClock } from 'react-icons/lu';
import dayjs from 'dayjs';
import { useGetTimesheets } from '../hooks/use-get-timesheets';
import { TimesheetsTable } from '../components/timesheets-table';
import { TimesheetFormModal } from '../components/timesheet-form-modal';
import { CloseMonthModal } from '../components/close-month-modal';
import { HistoricalReportsTable } from '../components/historical-reports-table';
import type { ITimesheet, ITimesheetDateGroup } from '../components/timesheet.interface';
import { useDebounce } from '@/hooks/use-debounce';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { LoadingOutlined } from '@ant-design/icons';

export function TimesheetsPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [modalOpen, setModalOpen] = useState(false);
  const [closeMonthModalOpen, setCloseMonthModalOpen] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<ITimesheet | undefined>(undefined);

  // Definimos el mes y año actual para filtrar la vista "Activo"
  const currentMonth = dayjs().format('MM');
  const currentYear = dayjs().format('YYYY');

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetTimesheets({
    terms: debouncedSearch,
  });

  // Filtramos los timesheets para que en la vista "Activo" solo se vean los del mes actual
  const timesheets = useMemo(() => {
    if (!data) return [];
    // Si estamos en la pestaña activo, solo mostramos lo del mes en curso
    // Nota: Si el usuario necesita ver meses anteriores no cerrados, esto podría ajustarse
    return data.filter((t) => {
      const tDate = dayjs(t.date);
      return tDate.format('MM') === currentMonth && tDate.format('YYYY') === currentYear;
    });
  }, [data, currentMonth, currentYear]);

  const observerTarget = useRef<HTMLDivElement>(null);

  useInfiniteScroll({
    observerTarget,
    onLoadMore: fetchNextPage,
    hasNextPage: hasNextPage ?? false,
    isLoading,
    isFetchingNextPage,
  });

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
    <div className="flex flex-col h-full bg-stone-100/40">
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-bold text-gray-800">Timesheets</h1>
        <div className="flex items-center gap-4">
          <Input.Search
            placeholder="Buscar..."
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-60"
            variant="filled"
          />
          <Button
            shape="circle"
            icon={<LuBell />}
            className="border-none shadow-none bg-gray-50 hover:bg-gray-100!"
          />
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto">
          {/* Tabs Navigation */}
          <div className="flex items-center gap-8 mb-8 border-b border-gray-100">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex items-center gap-2 pb-4 text-sm font-semibold transition-all relative ${
                activeTab === 'active' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <LuClock size={18} />
              <span>Activo</span>
              <span
                className={`ml-1 px-2 py-0.5 rounded-md text-[11px] ${
                  activeTab === 'active'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {uniqueDays} {uniqueDays === 1 ? 'día' : 'días'}
              </span>
              {activeTab === 'active' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 pb-4 text-sm font-semibold transition-all relative ${
                activeTab === 'history' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <LuClipboardCheck size={18} />
              <span>Históricos</span>
              <span
                className={`ml-1 px-2 py-0.5 rounded-md text-[11px] ${
                  activeTab === 'history'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                Historial
              </span>
              {activeTab === 'history' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          </div>

          {activeTab === 'active' ? (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">
                    Total de horas este mes ({dayjs().format('MMMM')})
                  </p>
                  <h2 className="text-3xl font-bold text-gray-800">{totalHours}h</h2>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    icon={<LuFilter />}
                    className="rounded-xl border-gray-200 text-gray-600 font-medium"
                  >
                    Filtrar
                  </Button>
                  <Button
                    icon={<LuClock className="text-gray-400" />}
                    className="rounded-xl border-gray-200 text-gray-600 font-medium"
                  >
                    Esta semana
                  </Button>
                  <Button
                    icon={<LuClipboardCheck className="text-indigo-500" />}
                    onClick={() => setCloseMonthModalOpen(true)}
                    className="rounded-xl border-gray-200 text-gray-600 font-medium hover:text-indigo-600! hover:border-indigo-500!"
                  >
                    Cerrar mes y generar reporte
                  </Button>
                  <Button
                    type="primary"
                    icon={<LuPlus />}
                    onClick={handleAdd}
                    className="rounded-xl font-semibold shadow-md shadow-indigo-200"
                  >
                    Agregar registro
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mt-2 px-4 pb-4">
                {timesheets.length > 0 ? (
                  <TimesheetsTable groups={groups} loading={isLoading} onEdit={handleEdit} />
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300">
                      <LuClock size={32} />
                    </div>
                    <div>
                      <p className="text-gray-800 font-bold">No hay registros este mes</p>
                      <p className="text-gray-400 text-sm">
                        Comienza a trackear tus horas haciendo clic en "Agregar registro"
                      </p>
                    </div>
                  </div>
                )}

                <div ref={observerTarget} className="flex justify-center py-8">
                  {isFetchingNextPage ? (
                    <Spin
                      indicator={<LoadingOutlined spin />}
                      size="large"
                      className="text-indigo-600"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Meses cerrados</h2>
                <p className="text-gray-500 text-sm">
                  Visualiza y edita (solo si están en borrador) los reportes de meses anteriores
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-4">
                <HistoricalReportsTable />
              </div>
            </div>
          )}
        </div>
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
