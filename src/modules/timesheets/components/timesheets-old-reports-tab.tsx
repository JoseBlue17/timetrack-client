import { OldReportsSection } from '@/modules/reports/components/old-reports-section';
import type { IOldPdfReport } from '@/modules/reports/components/reports.interface';

const ARCHIVED_PDF_REPORTS: IOldPdfReport[] = [];

export function TimesheetsOldReportsTab() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Reportes antiguos</h2>
        <p className="text-gray-500 text-sm">Sube reportes de meses anteriores en formato PDF</p>
      </div>

      <div className="p-4">
        <OldReportsSection uploadedPdfReports={ARCHIVED_PDF_REPORTS} />
      </div>
    </div>
  );
}
