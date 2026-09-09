import { useState } from 'react';
import { Table } from 'antd';

import { EmptyState } from '@/components/empty-state';
import { LoadingBox } from '@/components/loading-box';
import useLoggedUser from '@/hooks/use-logged-user';
import { useReportsList } from '@/modules/reports/hooks/use-reports-list';
import { ReportPdfModal } from '@/modules/reports/components/report-pdf-modal';
import { getHttpErrorMessage } from '@/config/http/error';
import { UserRole } from '@/enums';

import { getHistoricalReportsColumns } from './historical-reports-table.columns';
import { HistoricalReportDetailRow } from './historical-report-detail-row';

export function HistoricalReportsTable() {
  const { reports, error, isLoading } = useReportsList();
  const { loggedUser } = useLoggedUser();
  const userRole = loggedUser?.role ?? UserRole.Employee;
  const [selectedReport, setSelectedReport] = useState<{ id: string; name: string } | null>(null);

  const columns = getHistoricalReportsColumns({
    userRole,
    onViewReport: (report) => setSelectedReport({ id: report.id, name: report.monthName }),
  });

  if (isLoading) {
    return <LoadingBox text="Cargando historial de reportes..." />;
  }

  if (error) {
    return <EmptyState title="Error al cargar reportes" description={getHttpErrorMessage(error)} />;
  }

  if (!reports.length) {
    return (
      <EmptyState
        title="No hay reportes históricos"
        description="Los reportes cerrados aparecerán aquí"
      />
    );
  }

  return (
    <section>
      <Table
        columns={columns}
        dataSource={reports}
        rowKey="id"
        pagination={false}
        className="historical-reports-table shadow-sm rounded-lg"
        expandable={{
          rowExpandable: () => true,
          expandedRowRender: (record) => (
            <HistoricalReportDetailRow reportId={record.id} monthName={record.monthName} />
          ),
          expandIcon: () => null,
        }}
      />

      <ReportPdfModal
        open={!!selectedReport}
        reportId={selectedReport?.id ?? null}
        reportName={selectedReport?.name}
        onClose={() => setSelectedReport(null)}
      />
    </section>
  );
}
