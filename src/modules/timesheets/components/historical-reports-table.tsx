import { useState } from 'react';
import { Table } from 'antd';
import { isAxiosError } from 'axios';

import { EmptyState } from '@/components/empty-state';
import { LoadingBox } from '@/components/loading-box';
import { useScrollLoadMore } from '@/hooks/use-scroll-load-more';
import useLoggedUser from '@/hooks/use-logged-user';
import { useGetReportsInfinite } from '@/modules/reports/hooks/use-get-reports-infinite';
import { ReportPdfModal } from '@/modules/reports/components/report-pdf-modal';
import { UserRole } from '@/enums';

import { getHistoricalReportsColumns } from './historical-reports-table.columns';
import { HistoricalReportDetailRow } from './historical-report-detail-row';

export function HistoricalReportsTable() {
  const { reports, error, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetReportsInfinite();
  const { loggedUser } = useLoggedUser();
  const userRole = loggedUser?.role ?? UserRole.Employee;
  const [selectedReport, setSelectedReport] = useState<{ id: string; name: string } | null>(null);

  useScrollLoadMore({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const columns = getHistoricalReportsColumns({
    userRole,
    onViewReport: (report) => setSelectedReport({ id: report.id, name: report.monthName }),
  });

  if (isLoading) {
    return <LoadingBox text="Cargando historial de reportes..." />;
  }

  if (error) {
    return (
      <EmptyState
        title="Error al cargar reportes"
        description={
          isAxiosError(error)
            ? (error.response?.data?.message ?? error.message)
            : ((error as Error).message ?? 'Intenta de nuevo')
        }
      />
    );
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
