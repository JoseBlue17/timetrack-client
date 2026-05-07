import { useState } from 'react';
import { Button, Tag } from 'antd';
import { LuFileText, LuEye, LuPenTool } from 'react-icons/lu';
import { useSignReport } from '../hooks/use-sign-report';
import type { IMonthlyReport, MonthlyReportStatus } from './reports.interface';
import { ReportPdfModal } from './report-pdf-modal';

interface IMonthlyReportsListProps {
  monthlyReportsData: IMonthlyReport[];
}

const MONTHLY_REPORT_STATUS_COLORS: Record<MonthlyReportStatus, string> = {
  Borrador: 'blue',
  Aprobado: 'success',
  Pagado: 'cyan',
};

export function MonthlyReportsList({ monthlyReportsData }: IMonthlyReportsListProps) {
  const { mutate: signReport, isPending: isSigningReport } = useSignReport();
  const [selectedReport, setSelectedReport] = useState<{ id: string; name: string } | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
      <h2 className="text-lg font-bold text-gray-800 mb-6">Reportes mensuales generados</h2>

      <div className="flex flex-col gap-4">
        {!Array.isArray(monthlyReportsData) || monthlyReportsData.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-gray-50 rounded-2xl">
            <p className="text-gray-400 text-sm italic">
              No se han generado reportes mensuales todavía
            </p>
          </div>
        ) : (
          monthlyReportsData.map((reportItem) => (
            <div
              key={reportItem.id}
              className="flex items-center gap-4 p-5 bg-stone-50/50 rounded-2xl border border-stone-100/50 hover:border-indigo-100 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                <LuFileText size={24} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 text-base">{reportItem.monthName}</h3>
                <p className="text-gray-400 text-sm">
                  {reportItem.totalWorkedHours} horas · {reportItem.totalAmountInUsdt} USDT
                </p>
              </div>

              <div className="flex items-center gap-6">
                <Tag
                  color={MONTHLY_REPORT_STATUS_COLORS[reportItem.reportStatus]}
                  className="rounded-full px-4 py-0.5 border-none font-medium"
                >
                  {reportItem.reportStatus}
                </Tag>

                <div className="flex items-center gap-2">
                  <Button
                    type="text"
                    icon={<LuEye className="text-gray-400 group-hover:text-indigo-500" />}
                    onClick={() =>
                      setSelectedReport({ id: reportItem.id, name: reportItem.monthName })
                    }
                    className="flex items-center gap-2 text-gray-600 font-medium hover:text-indigo-600!"
                  >
                    Ver detalle
                  </Button>

                  {reportItem.reportStatus !== 'Pagado' && (
                    <Button
                      type="text"
                      icon={<LuPenTool className="text-gray-400 group-hover:text-indigo-500" />}
                      loading={isSigningReport}
                      onClick={() => signReport(reportItem.id)}
                      className="flex items-center gap-2 text-gray-600 font-medium hover:text-indigo-600!"
                    >
                      Firmar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ReportPdfModal
        open={!!selectedReport}
        reportId={selectedReport?.id ?? null}
        reportName={selectedReport?.name}
        onClose={() => setSelectedReport(null)}
      />
    </div>
  );
}
