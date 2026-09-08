import { Card } from 'antd';
import { LuClock3 } from 'react-icons/lu';

import { EmptyState } from '@/components/empty-state';

import type { IDashboardWeeklyHours } from './dashboard.interface';

interface WeeklyHoursChartProps {
  weeklyHours?: IDashboardWeeklyHours[];
}

export function WeeklyHoursChart({ weeklyHours = [] }: WeeklyHoursChartProps) {
  const maxHours = Math.max(12, ...weeklyHours.map((row) => row.hours));
  const hasData = weeklyHours.some((row) => row.hours > 0);

  return (
    <Card
      title="Horas esta semana"
      className="h-full border-gray-200 shadow-sm"
      styles={{ body: { minHeight: 250 } }}
    >
      {hasData ? (
        <div className="flex h-60 items-end gap-3 border-l border-b border-slate-300 px-3 pt-4">
          {weeklyHours.map((row) => {
            const height = `${Math.max((row.hours / maxHours) * 100, 4)}%`;

            return (
              <div key={row.date} className="flex h-full min-w-0 flex-1 flex-col items-center">
                <div className="flex h-full w-full items-end">
                  <div
                    className="w-full rounded-t-md bg-indigo-500 transition-all"
                    style={{ height }}
                    title={`${row.hours} horas`}
                  />
                </div>
                <span className="mt-2 text-sm capitalize text-slate-500">{row.dayLabel}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<LuClock3 size={32} />}
          title="Sin horas registradas"
          description="Las horas de esta semana aparecerán aquí."
          className="py-12"
        />
      )}
    </Card>
  );
}
