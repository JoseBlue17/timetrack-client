import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { toast } from 'sonner';
import useLoggedUser from '@/hooks/use-logged-user';
import { isAxiosError } from 'axios';
import type { ApiError } from '@/config/http';

export function useSignReport() {
  const queryClient = useQueryClient();
  const { loggedUser } = useLoggedUser();

  return useMutation({
    mutationFn: async (reportId: string) => {
      // Endpoint según el nuevo backend: POST /reports/:id/sign-employee
      // El backend pide un userId en el body según vi en el controlador
      const { data } = await Http.post(`/reports/${reportId}/sign-employee`, {
        userId: loggedUser?.id,
      });
      return data;
    },
    onSuccess: () => {
      toast.success('Reporte firmado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['reports-list'] });
    },
    onError: (error: unknown) => {
      const errorMessage = isAxiosError<ApiError>(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(errorMessage || 'Error al firmar el reporte');
    },
  });
}
