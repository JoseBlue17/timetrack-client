import { useState } from 'react';
import { useApproveReportAction } from '../hooks/use-approve-report-action';
import { useRejectReport } from '../hooks/use-reject-report';
import type { IMonthlyReport } from './reports.interface';
import { ReportListItem } from './report-list-item';
import { ReportPdfModal } from './report-pdf-modal';
import { ReportPaymentModal } from './report-payment-modal';
import { useLoggedUser, useCanEditConfiguration, useIsSupervisor } from '@/hooks';
import { UserRole } from '@/enums';

interface IMonthlyReportsListProps {
  monthlyReportsData: IMonthlyReport[];
}

export function MonthlyReportsList({ monthlyReportsData }: IMonthlyReportsListProps) {
  const { handleApprove, isApprovingReport } = useApproveReportAction();
  const { rejectReport, isRejectingReport } = useRejectReport();
  const [selectedReport, setSelectedReport] = useState<{ id: string; name: string } | null>(null);
  const [selectedReportForPayment, setSelectedReportForPayment] = useState<IMonthlyReport | null>(
    null,
  );
  const { loggedUser } = useLoggedUser();
  const isAdmin = useCanEditConfiguration();
  const isSupervisor = useIsSupervisor();
  const userRole = loggedUser?.role ?? UserRole.Employee;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
      <h2 className="text-lg font-bold text-gray-800 mb-6">Reportes mensuales generados</h2>

      <div className="flex flex-col gap-4">
        {!Array.isArray(monthlyReportsData) || monthlyReportsData.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-gray-50 rounded-2xl">
            <p className="text-gray-400 text-sm italic">
              No se han generado reportes mensuales todavía
            </p>
          </div>
        ) : (
          monthlyReportsData.map((reportItem) => (
            <ReportListItem
              key={reportItem.id}
              reportItem={reportItem}
              userRole={userRole}
              isSupervisor={isSupervisor}
              isAdmin={isAdmin}
              isApprovingReport={isApprovingReport}
              isRejectingReport={isRejectingReport}
              onViewDetail={(report) =>
                setSelectedReport({ id: report.id, name: report.monthName })
              }
              onApprove={handleApprove}
              onReject={rejectReport}
              onCreatePayment={setSelectedReportForPayment}
            />
          ))
        )}
      </div>

      <ReportPdfModal
        open={!!selectedReport}
        reportId={selectedReport?.id ?? null}
        reportName={selectedReport?.name}
        onClose={() => setSelectedReport(null)}
      />

      <ReportPaymentModal
        key={selectedReportForPayment?.id}
        report={selectedReportForPayment}
        onClose={() => setSelectedReportForPayment(null)}
      />
    </div>
  );
}
