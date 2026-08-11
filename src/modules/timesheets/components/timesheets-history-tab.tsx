import { HistoricalReportsTable } from './historical-reports-table';

export function TimesheetsHistoryTab() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Meses cerrados</h2>
        <p className="text-gray-500 text-sm">
          Visualiza (solo si están en borrador) los reportes de meses anteriores
        </p>
      </div>

      <div className="p-4">
        <HistoricalReportsTable />
      </div>
    </div>
  );
}
