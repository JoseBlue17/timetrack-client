import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import type { ApiError } from '@/config/http';

interface ICreateReportPayload {
  month: number;
  year: number;
}

export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ICreateReportPayload) => {
      const { data } = await Http.post('/timesheets/close-month', payload);
      return data;
    },
    onSuccess: () => {
      toast.success('Mes cerrado y reporte generado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['monthly-summary'] });
      // También podríamos invalidar el historial de reportes cuando lo tengamos
    },
    onError: (error: unknown) => {
      const errorMessage = isAxiosError<ApiError>(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(errorMessage || 'Error al cerrar el mes');
    },
  });
}
