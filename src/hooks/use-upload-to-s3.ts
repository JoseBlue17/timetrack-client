import { useState, useCallback } from 'react';
import { Http } from '@/config/http';
import { useShowError } from '@/hooks';
import type { AxiosResponseError } from '@/config/http';

interface IUploadUserSignatureResponse {
  signatureUrl: string;
}

export function useUploadToS3() {
  const [isUploading, setIsUploading] = useState(false);
  const { showError } = useShowError();

  const uploadUserSignature = useCallback(
    async (file: File): Promise<string | null> => {
      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const { signatureUrl } = await Http.post<IUploadUserSignatureResponse>(
          '/uploads/user-signature',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        ).then(({ data }) => data);

        return signatureUrl;
      } catch (error) {
        showError(error as AxiosResponseError);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [showError],
  );

  return { uploadUserSignature, isUploading };
}
