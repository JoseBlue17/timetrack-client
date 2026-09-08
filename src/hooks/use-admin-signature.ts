import { useCallback, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import useLoggedUser from './use-logged-user';
import { useUploadToS3 } from './use-upload-to-s3';
import { useSignatureDisplayUrl } from '@/modules/settings/hooks/signature/use-signature-display-url';
import { USER_PROFILE_QUERY_KEY } from '@/query-keys';

const LEGACY_ADMIN_SIGNATURE_KEY = 'timetrack_admin_signature';

function removeLegacyAdminSignature(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LEGACY_ADMIN_SIGNATURE_KEY);
}

export function useAdminSignature() {
  const { loggedUser, updateLoggedUser } = useLoggedUser();
  const { uploadUserSignature, isUploading } = useUploadToS3();
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const adminSignatureDataUrl = useMemo(
    () => loggedUser?.profile?.signatureImageUrl ?? null,
    [loggedUser?.profile?.signatureImageUrl],
  );

  const adminSignatureDisplayUrl = useSignatureDisplayUrl(adminSignatureDataUrl);

  const setAdminSignatureDataUrl = useCallback(
    async (file: File | null) => {
      if (file === null) {
        removeLegacyAdminSignature();
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

  return {
    adminSignatureDataUrl,
    adminSignatureDisplayUrl,
    setAdminSignatureDataUrl,
    isUploadingAdminSignature: isUploading || isSaving,
  };
}
