import { useCallback, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import useLoggedUser from './use-logged-user';
import { useUploadToS3 } from './use-upload-to-s3';
import { USER_PROFILE_QUERY_KEY } from '@/query-keys';

const LEGACY_SIGNATURE_KEY = 'timetrack_signature';

function removeLegacySignature(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LEGACY_SIGNATURE_KEY);
}

export function useSignature() {
  const { loggedUser, updateLoggedUser } = useLoggedUser();
  const { uploadUserSignature, isUploading } = useUploadToS3();
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const signatureUrl = useMemo(
    () => loggedUser?.profile?.signatureImageUrl ?? null,
    [loggedUser?.profile?.signatureImageUrl],
  );

  const setSignature = useCallback(
    async (file: File | null) => {
      if (file === null) {
        removeLegacySignature();
        const updatedUser = {
          ...loggedUser!,
          profile: { ...loggedUser!.profile!, signatureImageUrl: undefined },
        };
        updateLoggedUser(updatedUser);
        queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
        return;
      }

      setIsSaving(true);

      try {
        const signatureUrl = await uploadUserSignature(file);
        if (!signatureUrl) return;

        const updatedUser = {
          ...loggedUser!,
          profile: { ...loggedUser!.profile!, signatureImageUrl: signatureUrl },
        };
        updateLoggedUser(updatedUser);
        queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
      } finally {
        setIsSaving(false);
      }
    },
    [loggedUser, uploadUserSignature, updateLoggedUser, queryClient],
  );

  return { signatureUrl, setSignature, isUploading: isUploading || isSaving };
}
