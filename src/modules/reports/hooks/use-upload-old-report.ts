import { useMutation } from '@tanstack/react-query';
import { Http } from '@/config/http';
import { useShowError, useShowSuccess, useInvalidateOldReports } from '@/hooks';
import type { AxiosResponseError } from '@/config/http';

export interface IUploadOldReportPayload {
  file: File;
  pdfFileName: string;
  referenceMonth: number;
  referenceYear: number;
}

export function useUploadOldReport() {
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();
  const invalidateOldReports = useInvalidateOldReports();

  const { mutate: uploadOldReport, isPending: isUploading } = useMutation({
    mutationFn: async (payload: IUploadOldReportPayload) => {
      const formData = new FormData();
      formData.append('file', payload.file);
      formData.append('pdfFileName', payload.pdfFileName);
      formData.append('referenceMonth', String(payload.referenceMonth));
      formData.append('referenceYear', String(payload.referenceYear));

      const { data } = await Http.post('/reports/old-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      showSuccess({
        title: 'Reporte subido',
        description: 'El reporte antiguo se ha subido correctamente.',
      });
      invalidateOldReports();
    },
    onError: (error: AxiosResponseError) => showError(error),
  });

  return { uploadOldReport, isUploading };
}
