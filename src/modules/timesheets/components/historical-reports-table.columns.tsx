import { Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { LuEye, LuFileText } from 'react-icons/lu';

import { StatusTag } from '@/components/status-tag';
import {
  getReportStatusMapping,
  STATUS_TAG_COLORS,
} from '@/modules/reports/components/report-status-mappings';
import type { IMonthlyReport } from '@/modules/reports/components/reports.interface';

interface GetHistoricalReportsColumnsProps {
  userRole: string;
  onViewReport: (report: IMonthlyReport) => void;
}

export function getHistoricalReportsColumns({
  userRole,
  onViewReport,
}: GetHistoricalReportsColumnsProps): ColumnsType<IMonthlyReport> {
  return [
    {
      title: 'Mes',
      dataIndex: 'monthName',
      key: 'monthName',
      render: (text: string) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
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
      render: (status) => {
        const mapping = getReportStatusMapping(status, userRole);
        return (
          <StatusTag
            label={mapping.label}
            color={STATUS_TAG_COLORS[mapping.color]}
            className="rounded-full border-none px-4 py-0.5 font-medium"
          />
        );
      },
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
      align: 'center',
      render: (_: unknown, record: IMonthlyReport) => (
        <div className="flex justify-center gap-4">
          <Button
            type="text"
            aria-label="Ver reporte"
            className="group flex items-center justify-center text-indigo-600 font-semibold hover:text-indigo-700!"
            icon={<LuEye size={18} className="text-gray-400 group-hover:text-indigo-500" />}
            onClick={() => onViewReport(record)}
          />
        </div>
      ),
    },
  ];
}
