import { useQuery } from '@tanstack/react-query';
import { Http } from '@/config/http';
import type { IMonthlyReport, MonthlyReportStatus } from '../components/reports.interface';

type BackendReportStatus = 'draft' | 'approved' | 'paid' | (string & {});

interface BackendMonthlyReport {
  id?: string;
  _id?: string;
  month: number;
  year: number;
  totalHours?: number;
  totalAmount?: number;
  status?: BackendReportStatus;
  employeeSigned?: boolean;
}

interface IReportsPaginatedResponse {
  data: BackendMonthlyReport[];
  nextCursor: string | null;
}

export function useGetReports() {
  return useQuery({
    queryKey: ['reports-list'],
    queryFn: async () => {
      const { data } = await Http.get<IReportsPaginatedResponse>('/reports');
      const monthNames = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ];

      // Mapeamos los datos del backend a nuestra interfaz de frontend
      return data.data.map((report) => ({
        id: report.id || report._id,
        monthName: `${monthNames[report.month - 1]} ${report.year}`,
        totalWorkedHours: report.totalHours || 0,
        totalAmountInUsdt: report.totalAmount || 0,
        reportStatus: (report.status === 'draft'
          ? 'Borrador'
          : report.status === 'approved'
            ? 'Aprobado'
            : report.status === 'paid'
              ? 'Pagado'
              : 'Borrador') as MonthlyReportStatus,
        isSigned: report.employeeSigned || false,
      })) as IMonthlyReport[];
    },
  });
}
