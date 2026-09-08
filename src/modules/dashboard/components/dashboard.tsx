import { Tag } from 'antd';
import { LuCircleAlert, LuClock3, LuDollarSign, LuFileText, LuTrendingUp } from 'react-icons/lu';

import { EmptyState } from '@/components/empty-state';
import { LoadingBox } from '@/components/loading-box';
import { PageHeader } from '@/components/page-header';

import { useGetDashboardSummary } from '../hooks/use-get-dashboard-summary';
import { DashboardMetricCard } from './dashboard-metric-card';
import { LatestReportsList } from './latest-reports-list';
import { PaymentHistoryList } from './payment-history-list';
import { WeeklyHoursChart } from './weekly-hours-chart';
import {
  formatHours,
  formatUsdt,
  getPaymentAmount,
  getPaymentStatusColor,
  getPaymentStatusLabel,
  getReportStatusColor,
  getReportStatusLabel,
} from './dashboard.utils';

export function DashboardPageComponent() {
  const { dashboardSummary, isLoading, isError, error } = useGetDashboardSummary();
  const hoursDelta = dashboardSummary?.monthlyHoursDeltaPercent ?? 0;
  const lastPayment = dashboardSummary?.lastPayment;

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <PageHeader title="Dashboard" />

      <main className="flex-1 overflow-auto p-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          {isError && (
            <EmptyState
              icon={<LuCircleAlert size={32} />}
              title="Error al cargar dashboard"
              description={error?.message ?? 'Intenta de nuevo'}
              className="rounded-2xl border border-red-100 bg-white text-red-500"
            />
          )}

          {!isError && isLoading && !dashboardSummary ? (
            <LoadingBox text="Cargando dashboard..." />
          ) : !isError ? (
            <>
              <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                <DashboardMetricCard
                  title="Horas este mes"
                  value={formatHours(dashboardSummary?.monthlyHours)}
                  detail={
                    <span
                      className={`inline-flex items-center gap-1 text-sm font-medium ${
                        hoursDelta >= 0 ? 'text-emerald-600' : 'text-red-500'
                      }`}
                    >
                      <LuTrendingUp size={15} />
                      {hoursDelta >= 0 ? '+' : ''}
                      {hoursDelta}% vs mes anterior
                    </span>
                  }
                  icon={<LuClock3 size={24} />}
                  iconClassName="bg-indigo-50 text-indigo-500"
                />
                <DashboardMetricCard
                  title="Ganancias estimadas"
                  value={formatUsdt(dashboardSummary?.estimatedEarnings)}
                  detail={`Tasa: $${dashboardSummary?.hourlyRate ?? 0}/hora`}
                  icon={<LuDollarSign size={24} />}
                  iconClassName="bg-emerald-50 text-emerald-500"
                />
                <DashboardMetricCard
                  title="Último pago"
                  value={formatUsdt(lastPayment ? getPaymentAmount(lastPayment) : 0)}
                  detail={
                    lastPayment ? (
                      <Tag color={getPaymentStatusColor(lastPayment.status)}>
                        {getPaymentStatusLabel(lastPayment.status)}
                      </Tag>
                    ) : (
                      <Tag>Sin pagos</Tag>
                    )
                  }
                  icon={<LuDollarSign size={24} />}
                  iconClassName="bg-teal-50 text-teal-500"
                />
                <DashboardMetricCard
                  title="Reportes pendientes"
                  value={dashboardSummary?.pendingReportsCount ?? 0}
                  detail={
                    <Tag color={getReportStatusColor('signed_by_employee')}>
                      {getReportStatusLabel('signed_by_employee')}
                    </Tag>
                  }
                  icon={<LuFileText size={24} />}
                  iconClassName="bg-amber-50 text-amber-500"
                />
              </section>

              <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <WeeklyHoursChart weeklyHours={dashboardSummary?.weeklyHours} />
                <LatestReportsList reports={dashboardSummary?.latestReports} />
              </section>

              <PaymentHistoryList payments={dashboardSummary?.paymentHistory} />
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}
