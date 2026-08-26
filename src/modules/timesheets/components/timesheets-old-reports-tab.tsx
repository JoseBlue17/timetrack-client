import { OldReportsSection } from '@/modules/reports/components/old-reports-section';

export function TimesheetsOldReportsTab() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="p-4">
        <OldReportsSection />
      </div>
    </div>
  );
}
