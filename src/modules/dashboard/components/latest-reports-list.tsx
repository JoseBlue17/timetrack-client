import { Card, List, Tag } from 'antd';
import { LuFileText } from 'react-icons/lu';

import { EmptyState } from '@/components/empty-state';

import type { IDashboardReport } from './dashboard.interface';
import {
  formatHours,
  formatMonthYear,
  formatUsdt,
  getReportStatusColor,
  getReportStatusLabel,
} from './dashboard.utils';

interface LatestReportsListProps {
  reports?: IDashboardReport[];
}

export function LatestReportsList({ reports = [] }: LatestReportsListProps) {
  return (
    <Card title="Últimos reportes" className="h-full border-gray-200 shadow-sm">
      {reports.length > 0 ? (
        <List
          dataSource={reports}
          split
          renderItem={(report) => (
            <List.Item
              actions={[
                <Tag key="status" color={getReportStatusColor(report.status)}>
                  {getReportStatusLabel(report.status)}
                </Tag>,
              ]}
            >
              <List.Item.Meta
                title={
                  <span className="text-base font-medium">
                    {formatMonthYear(report.month, report.year)}
                  </span>
                }
                description={
                  <span className="text-slate-500">{formatHours(report.totalHours)}</span>
                }
              />
              <span className="font-medium text-slate-950">{formatUsdt(report.totalAmount)}</span>
            </List.Item>
          )}
        />
      ) : (
        <EmptyState
          icon={<LuFileText size={32} />}
          title="Sin reportes recientes"
          description="Tus reportes aparecerán cuando cierres un periodo."
          className="py-12"
        />
      )}
    </Card>
  );
}
