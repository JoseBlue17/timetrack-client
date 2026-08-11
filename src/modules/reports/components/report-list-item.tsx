import { Button, Tag } from 'antd';
import { LuEye, LuPenTool, LuCreditCard, LuCircleStop, LuFileText } from 'react-icons/lu';
import type { IMonthlyReport } from './reports.interface';
import { getReportStatusMapping, STATUS_TAG_COLORS } from './report-status-mappings';
import { ReportStatus, UserRole } from '@/enums';

interface IReportListItemProps {
  reportItem: IMonthlyReport;
  userRole: UserRole;
  isSupervisor: boolean;
  isAdmin: boolean;
  isApprovingReport: boolean;
  isRejectingReport: boolean;
  onViewDetail: (report: IMonthlyReport) => void;
  onApprove: (reportId: string) => void;
  onReject: (reportId: string) => void;
  onCreatePayment: (report: IMonthlyReport) => void;
}

export function ReportListItem({
  reportItem,
  userRole,
  isSupervisor,
  isAdmin,
  isApprovingReport,
  isRejectingReport,
  onViewDetail,
  onApprove,
  onReject,
  onCreatePayment,
}: IReportListItemProps) {
  const statusMapping = getReportStatusMapping(reportItem.reportStatus, userRole);

  return (
    <div className="flex items-center gap-4 p-5 bg-stone-50/50 rounded-2xl border border-stone-100/50 hover:border-indigo-100 transition-colors group">
      <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
        <LuFileText size={24} />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-800 text-base">
          {reportItem.userName
            ? `${reportItem.userName} - ${reportItem.monthName}`
            : reportItem.monthName}
        </h3>
        <p className="text-gray-400 text-sm">
          {reportItem.totalWorkedHours} horas · {reportItem.totalAmountInUsdt} USDT
          {reportItem.supervisorName ? ` · ${reportItem.supervisorName}` : ''}
        </p>
      </div>

      <div className="flex items-center gap-6">
        <Tag
          color={STATUS_TAG_COLORS[statusMapping.color]}
          className="rounded-full px-4 py-0.5 border-none font-medium"
        >
          {statusMapping.label}
        </Tag>

        <div className="flex items-center gap-2">
          <Button
            type="text"
            icon={<LuEye className="text-gray-400 group-hover:text-indigo-500" />}
            onClick={() => onViewDetail(reportItem)}
            className="flex items-center gap-2 text-gray-600 font-medium hover:text-indigo-600!"
          >
            Ver detalle
          </Button>

          {isSupervisor && reportItem.reportStatus === ReportStatus.SignedByEmployee && (
            <>
              <Button
                type="text"
                loading={isApprovingReport}
                icon={<LuPenTool className="text-gray-400 group-hover:text-indigo-500" />}
                onClick={() => onApprove(reportItem.id)}
                className="flex items-center gap-2 text-green-600 font-medium hover:text-green-700!"
              >
                Aprobar
              </Button>
              <Button
                type="text"
                danger
                loading={isRejectingReport}
                icon={<LuCircleStop className="text-gray-400 group-hover:text-red-500" />}
                onClick={() => onReject(reportItem.id)}
                className="flex items-center gap-2 text-red-600 font-medium hover:text-red-700!"
              >
                Rechazar
              </Button>
            </>
          )}

          {isAdmin &&
            reportItem.reportStatus === ReportStatus.Approved &&
            !reportItem.paymentId && (
              <Button
                type="text"
                icon={<LuCreditCard className="text-gray-400 group-hover:text-indigo-500" />}
                onClick={() => onCreatePayment(reportItem)}
                className="flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700!"
              >
                Crear pago
              </Button>
            )}
        </div>
      </div>
    </div>
  );
}
