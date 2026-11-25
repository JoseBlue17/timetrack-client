import { useState, useCallback } from 'react';
import { Http } from '@/config/http';
import { validateUpload } from '@/helpers/validate-upload';
import { getSessionGeneration, isCurrentSession } from '@/helpers/auth-session';
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
      const generation = getSessionGeneration();
      setIsUploading(true);

      try {
        validateUpload(file, 'signature');
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

        return isCurrentSession(generation) ? signatureUrl : null;
      } catch (error) {
        if (isCurrentSession(generation)) showError(error as AxiosResponseError);
        return null;
      } finally {
        if (isCurrentSession(generation)) setIsUploading(false);
      }
    },
    [showError],
  );

  return { uploadUserSignature, isUploading };
}
