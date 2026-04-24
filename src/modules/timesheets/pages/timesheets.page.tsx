import { useMemo, useState } from 'react';
import { Button, Input } from 'antd';
import { BellOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons';
import { useGetTimesheets } from '../hooks/use-get-timesheets';
import { TimesheetsTable } from '../components/timesheets-table';
import { TimesheetFormModal } from '../components/timesheet-form-modal';
import type { ITimesheet, ITimesheetDateGroup } from '../timesheet.interface';

export function TimesheetsPage() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<ITimesheet | undefined>(undefined);

  const { data, isLoading } = useGetTimesheets({ search });

  const timesheets = useMemo(() => data?.timesheets ?? [], [data?.timesheets]);

  const totalHours = useMemo(() => timesheets.reduce((sum, t) => sum + t.hours, 0), [timesheets]);

  const groups = useMemo<ITimesheetDateGroup[]>(() => {
    const map = new Map<string, ITimesheet[]>();
    for (const t of timesheets) {
      const key = t.date.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, items]) => ({
        date,
        projects: new Set(items.map((t) => t.project)).size,
        totalHours: items.reduce((s, t) => s + t.hours, 0),
        timesheets: items,
      }));
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
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-bold text-gray-800">Timesheets</h1>
        <div className="flex items-center gap-4">
          <Input.Search
            placeholder="Buscar..."
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-60"
          />
          <Button shape="circle" icon={<BellOutlined />} />
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8 bg-gray-50">
        <div className="mb-4 text-gray-600 font-medium">
          Total de horas registradas:{' '}
          <span className="text-indigo-600 font-bold">{totalHours}h</span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Button icon={<FilterOutlined />}>Filtrar</Button>
          <Button>Esta semana</Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
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
    </div>
  );
}
