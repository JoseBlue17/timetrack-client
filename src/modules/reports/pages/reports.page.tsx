import { OldReportsSection } from '../components/old-reports-section';
import { useReportsList } from '../hooks/use-reports-list';
import { PageHeader } from '@/components/page-header';
import { useScrollHandlers } from '@/contexts/scroll-handlers-context';

export function ReportsPage() {
  const { handleScroll } = useScrollHandlers();
  const { reports: monthlyReportsHistory } = useReportsList();

  return (
    <div className="flex flex-col h-full bg-stone-100/40">
      <PageHeader title="Reportes" />

      <main className="flex-1 overflow-auto p-8" onScroll={handleScroll}>
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          <OldReportsSection monthlyReportsData={monthlyReportsHistory} />
        </div>
      </main>
    </div>
  );
}
