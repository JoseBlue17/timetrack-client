import { OldReportsSection } from '../components/old-reports-section';
import { useGetReportsInfinite } from '../hooks/use-get-reports-infinite';
import { PageHeader } from '@/components/page-header';

export function ReportsPage() {
  const {
    reports: monthlyReportsHistory = [],
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetReportsInfinite();

  return (
    <div className="flex flex-col h-full bg-stone-100/40">
      <PageHeader title="Reportes" />

      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          <OldReportsSection
            monthlyReportsData={monthlyReportsHistory}
            hasMoreMonthlyReports={hasNextPage}
            isLoadingMoreMonthlyReports={isFetchingNextPage}
            onLoadMoreMonthlyReports={fetchNextPage}
          />
        </div>
      </main>
    </div>
  );
}
