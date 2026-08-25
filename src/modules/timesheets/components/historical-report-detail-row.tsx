import { Spin } from 'antd';

import { useGetReportPdf } from '@/modules/reports/hooks/use-get-report-pdf';

interface HistoricalReportDetailRowProps {
  reportId: string;
  monthName: string;
}

export function HistoricalReportDetailRow({ reportId, monthName }: HistoricalReportDetailRowProps) {
  const { reportPdfUrl, isLoading } = useGetReportPdf(reportId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spin size="small" />
        <span className="ml-2 text-sm text-gray-400">Cargando PDF...</span>
      </div>
    );
  }

  if (!reportPdfUrl) {
    return (
      <div className="ml-12 rounded-2xl border border-stone-100 bg-stone-50 p-4">
        <p className="text-center text-sm italic text-gray-400">
          No hay PDF generado para el mes de {monthName}
        </p>
      </div>
    );
  }

  return (
    <div className="ml-12 rounded-2xl border border-stone-100 bg-stone-50 p-2">
      <iframe
        src={reportPdfUrl}
        className="w-full rounded-xl border border-gray-200"
        style={{ height: '500px' }}
        title={`PDF ${monthName}`}
      />
    </div>
  );
}
