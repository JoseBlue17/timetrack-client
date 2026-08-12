import { Tabs } from 'antd';
import { LuClock, LuClipboardCheck, LuArchive } from 'react-icons/lu';
import { TimesheetsActiveTab } from '../components/timesheets-active-tab';
import { TimesheetsHistoryTab } from '../components/timesheets-history-tab';
import { TimesheetsOldReportsTab } from '../components/timesheets-old-reports-tab';
import { TimesheetFormModal } from '../components/timesheet-form-modal';
import { useTimesheetsPage } from '../hooks/use-timesheets-page';
import { PageHeader } from '@/components/page-header';

export function TimesheetsPage() {
  const {
    activeTab,
    setActiveTab,
    modalOpen,
    selectedTimesheet,
    selectedDate,
    setSelectedDate,
    isLoading,
    isFetchingNextPage,
    isClosingMonth,
    totalHours,
    uniqueDays,
    groups,
    timesheets,
    handleCloseMonth,
    handleEdit,
    handleAdd,
    handleClose,
    observerTarget,
  } = useTimesheetsPage();

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader title="Timesheets" />

      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto">
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key as 'active' | 'history' | 'old-reports')}
            items={[
              {
                key: 'active',
                label: (
                  <span className="flex items-center gap-2">
                    <LuClock size={18} />
                    Activo
                    <span className="ml-1 px-2 py-0.5 rounded-md text-[11px] bg-indigo-50 text-indigo-600">
                      {uniqueDays} {uniqueDays === 1 ? 'día' : 'días'}
                    </span>
                  </span>
                ),
                children: (
                  <TimesheetsActiveTab
                    timesheets={timesheets}
                    groups={groups}
                    totalHours={totalHours}
                    selectedDate={selectedDate}
                    isLoading={isLoading}
                    isClosingMonth={isClosingMonth}
                    isFetchingNextPage={isFetchingNextPage}
                    observerTarget={observerTarget}
                    onDateChange={setSelectedDate}
                    onCloseMonth={handleCloseMonth}
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                  />
                ),
              },
              {
                key: 'history',
                label: (
                  <span className="flex items-center gap-2">
                    <LuClipboardCheck size={18} />
                    Históricos
                  </span>
                ),
                children: <TimesheetsHistoryTab />,
              },
              {
                key: 'old-reports',
                label: (
                  <span className="flex items-center gap-2">
                    <LuArchive size={18} />
                    Reportes antiguos
                  </span>
                ),
                children: <TimesheetsOldReportsTab />,
              },
            ]}
            className="mb-8"
          />
        </div>
      </main>

      {modalOpen && (
        <TimesheetFormModal open={modalOpen} onClose={handleClose} timesheet={selectedTimesheet} />
      )}
    </div>
  );
}
