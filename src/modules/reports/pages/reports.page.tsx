import { Input, Button } from 'antd';
import { LuBell } from 'react-icons/lu';
import { MonthlyReportsList } from '../components/monthly-reports-list';
import { OldReportsSection } from '../components/old-reports-section';
import { useGetReports } from '../hooks/use-get-reports';
import type { IOldPdfReport } from '../components/reports.interface';

export function ReportsPage() {
  const { data: monthlyReportsHistory = [] } = useGetReports();
  const archivedPdfReports: IOldPdfReport[] = [];

  return (
    <div className="flex flex-col h-full bg-stone-100/40">
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-bold text-gray-800">Reportes</h1>
        <div className="flex items-center gap-4">
          <Input.Search placeholder="Buscar..." allowClear className="w-60" variant="filled" />
          <Button
            shape="circle"
            icon={<LuBell />}
            className="border-none shadow-none bg-gray-50 hover:bg-gray-100!"
          />
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          <MonthlyReportsList monthlyReportsData={monthlyReportsHistory} />

          <OldReportsSection uploadedPdfReports={archivedPdfReports} />
        </div>
      </main>
    </div>
  );
}
