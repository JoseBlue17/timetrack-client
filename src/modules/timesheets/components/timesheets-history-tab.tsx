import { HistoricalReportsTable } from './historical-reports-table';

export function TimesheetsHistoryTab() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className=" mt-4 bg-white p-6 rounded-2xl border border-gray-200">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-gray-800">Meses cerrados</h2>
            <p className="text-sm text-gray-500">
              Visualiza (solo si están en borrador) los reportes de meses anteriores
            </p>
          </div>
        </div>
      </div>

      <HistoricalReportsTable />
    </div>
  );
}
