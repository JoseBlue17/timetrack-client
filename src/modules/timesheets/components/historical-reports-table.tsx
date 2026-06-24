import { useState } from 'react';
import { Table, Button, Tag, Spin } from 'antd';
import { LuEye, LuFileText } from 'react-icons/lu';
import { useGetReports } from '@/modules/reports/hooks/use-get-reports';
import type { IMonthlyReport } from '@/modules/reports/components/reports.interface';
import { ReportPdfModal } from '@/modules/reports/components/report-pdf-modal';
import { OldReportsSection } from '@/modules/reports/components/old-reports-section';
import type { IOldPdfReport } from '@/modules/reports/components/reports.interface';
import { useLoggedUser } from '@/hooks';
import {
  getReportStatusMapping,
  STATUS_TAG_COLORS,
} from '@/modules/reports/components/report-status-mappings';
import type { ReportStatus } from '@/enums';

const ARCHIVED_PDF_REPORTS: IOldPdfReport[] = [];

export function HistoricalReportsTable() {
  const { reports, isLoading } = useGetReports();
  const [selectedReport, setSelectedReport] = useState<{ id: string; name: string } | null>(null);
  const { loggedUser } = useLoggedUser();
  const userRole = loggedUser?.role ?? 'basic';

  const renderStatus = (status: ReportStatus) => {
    const mapping = getReportStatusMapping(status, userRole);
    return (
      <Tag
        color={STATUS_TAG_COLORS[mapping.color]}
        className="rounded-full px-4 py-0.5 border-none font-medium"
      >
        {mapping.label}
      </Tag>
    );
  };

  const columns = [
    {
      title: 'Mes',
      dataIndex: 'monthName',
      key: 'monthName',
      render: (text: string) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
            <LuFileText size={16} />
          </div>
          <span className="font-bold text-gray-700">{text}</span>
        </div>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'reportStatus',
      key: 'reportStatus',
      render: renderStatus,
    },
    {
      title: 'Total horas',
      dataIndex: 'totalWorkedHours',
      key: 'totalWorkedHours',
      render: (hours: number) => <span className="font-semibold text-gray-600">{hours}h</span>,
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: unknown, record: IMonthlyReport) => (
        <div className="flex gap-4">
          <Button
            type="text"
            icon={<LuEye size={18} className="text-gray-400 group-hover:text-indigo-500" />}
            onClick={() => setSelectedReport({ id: record.id, name: record.monthName })}
            className="flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700! group"
          >
            Ver detalles
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center gap-4">
        <Spin size="large" className="text-indigo-600" />
        <p className="text-gray-400 animate-pulse font-medium">Cargando historial de reportes...</p>
      </div>
    );
  }

  return (
    <section>
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <Table
          columns={columns}
          dataSource={reports}
          rowKey="id"
          pagination={false}
          expandable={{
            rowExpandable: () => true,
            expandedRowRender: (record) => (
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 ml-12">
                <p className="text-gray-500 italic text-sm text-center">
                  Detalle del mes de {record.monthName} (funcionalidad en desarrollo)
                </p>
              </div>
            ),
          }}
          className="historical-reports-table"
        />
      </div>
      <OldReportsSection uploadedPdfReports={ARCHIVED_PDF_REPORTS} />

      <ReportPdfModal
        open={!!selectedReport}
        reportId={selectedReport?.id ?? null}
        reportName={selectedReport?.name}
        onClose={() => setSelectedReport(null)}
      />
    </section>
  );
}
