import { useQuery } from '@tanstack/react-query';
import { Http } from '@/config/http';

interface IMonthlySummaryResponse {
  totalHours: number;
  totalAmount: number; // En USDT
  uniqueDays: number;
}

export function useGetMonthlySummary(month: string, year: string) {
  // Nota: La URL base de la API debería venir de una configuración, aquí usamos el estándar del proyecto
  return useQuery({
    queryKey: ['monthly-summary', month, year],
    queryFn: async () => {
      const { data } = await Http.get<IMonthlySummaryResponse>(`/timesheets/summary/monthly`, {
        params: { month, year },
      });
      return data;
    },
    enabled: !!month && !!year,
  });
}
