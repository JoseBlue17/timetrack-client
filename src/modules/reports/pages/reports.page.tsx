import { OldReportsSection } from '../components/old-reports-section';
import { useGetReports } from '../hooks/use-get-reports';
import { PageHeaderActions } from '@/components/page-header-actions';
import type { IOldPdfReport } from '../components/reports.interface';

const ARCHIVED_PDF_REPORTS: IOldPdfReport[] = [];

export function ReportsPage() {
  const { reports: monthlyReportsHistory = [] } = useGetReports();

  return (
    <div className="flex flex-col h-full bg-stone-100/40">
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-bold text-gray-800">Reportes</h1>
        <PageHeaderActions />
      </header>

      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          <OldReportsSection
            monthlyReportsData={monthlyReportsHistory}
            uploadedPdfReports={ARCHIVED_PDF_REPORTS}
          />
        </div>
      </main>
    </div>
  );
}
