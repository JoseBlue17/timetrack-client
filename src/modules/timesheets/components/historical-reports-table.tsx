import { Table, Button, Tag, Spin } from 'antd';
import { LuEye, LuPencil, LuFileText } from 'react-icons/lu';
import { useGetReports } from '@/modules/reports/hooks/use-get-reports';
import type {
  IMonthlyReport,
  MonthlyReportStatus,
} from '@/modules/reports/components/reports.interface';

const STATUS_COLORS: Record<MonthlyReportStatus, string> = {
  Borrador: 'processing',
  Aprobado: 'success',
  Pagado: 'cyan',
};

export function HistoricalReportsTable() {
  const { data: reports, isLoading } = useGetReports();

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
      render: (status: MonthlyReportStatus) => (
        <Tag
          color={STATUS_COLORS[status]}
          className="rounded-full px-4 py-0.5 border-none font-medium"
        >
          {status}
        </Tag>
      ),
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
            className="flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700! group"
          >
            Ver detalles
          </Button>
          {record.reportStatus === 'Borrador' && (
            <Button
              type="text"
              icon={<LuPencil size={18} className="text-gray-400 group-hover:text-indigo-500" />}
              className="flex items-center gap-2 text-gray-500 font-semibold hover:text-indigo-600! group"
            >
              Editar
            </Button>
          )}
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
  );
}
