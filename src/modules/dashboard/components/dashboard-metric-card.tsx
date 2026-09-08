import { Card, Tag } from 'antd';
import type { ReactNode } from 'react';

interface DashboardMetricCardProps {
  title: string;
  value: ReactNode;
  detail?: ReactNode;
  icon: ReactNode;
  iconClassName: string;
}

export function DashboardMetricCard({
  title,
  value,
  detail,
  icon,
  iconClassName,
}: DashboardMetricCardProps) {
  return (
    <Card className="h-full border-gray-200 shadow-sm" styles={{ body: { padding: 24 } }}>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="mb-3 text-base text-slate-500">{title}</p>
          <div className="mb-2 text-2xl font-semibold leading-none text-slate-950">{value}</div>
          {typeof detail === 'string' ? <Tag color="default">{detail}</Tag> : detail}
        </div>
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${iconClassName}`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}
