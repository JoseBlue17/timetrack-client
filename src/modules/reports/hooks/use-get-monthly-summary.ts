import { useQuery } from '@tanstack/react-query';
import { Http } from '@/config/http';

interface IMonthlySummaryTimesheet {
  id: string;
  date: string;
}

interface IMonthlySummaryResponse {
  totalHours: number;
  // Legacy fields (older backend)
  totalAmount?: number; // En USDT
  uniqueDays?: number;

  // Current backend fields (payment-system)
  totalFacturado?: number;
  totalEntries?: number;
  timesheets?: IMonthlySummaryTimesheet[];
}

export function useGetMonthlySummary(month: string, year: string) {
  // Nota: La URL base de la API debería venir de una configuración, aquí usamos el estándar del proyecto
  return useQuery({
    queryKey: ['MONTHLY_SUMMARY', month, year],
    queryFn: async () => {
      const { data } = await Http.get<IMonthlySummaryResponse>(`/timesheets/summary/monthly`, {
        params: { month, year },
      });
      return data;
    },
    enabled: !!month && !!year,
  });
}
