import { useCallback, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import useLoggedUser from './use-logged-user';
import { useUploadToS3 } from './use-upload-to-s3';
import { useSignatureDisplayUrl } from '@/modules/settings/hooks/signature/use-signature-display-url';
import { USER_PROFILE_QUERY_KEY } from '@/query-keys';
import { useUpdateProfile } from './use-update-profile';
import { getSessionGeneration, isCurrentSession } from '@/helpers/auth-session';

const LEGACY_ADMIN_SIGNATURE_KEY = 'timetrack_admin_signature';

function removeLegacyAdminSignature(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LEGACY_ADMIN_SIGNATURE_KEY);
}

export function useAdminSignature() {
  const { loggedUser, updateLoggedUser } = useLoggedUser();
  const { uploadUserSignature, isUploading } = useUploadToS3();
  const [isSaving, setIsSaving] = useState(false);
  const { updateProfileAsync, isUpdatingProfile } = useUpdateProfile();
  const queryClient = useQueryClient();

  const adminSignatureDataUrl = useMemo(
    () => loggedUser?.profile?.signatureImageUrl ?? null,
    [loggedUser?.profile?.signatureImageUrl],
  );

  const adminSignatureDisplayUrl = useSignatureDisplayUrl(adminSignatureDataUrl);

  const setAdminSignatureDataUrl = useCallback(
    async (file: File | null): Promise<boolean> => {
      if (!loggedUser?.profile) return false;
      const generation = getSessionGeneration();
      if (file === null) {
        try {
          await updateProfileAsync({
            firstName: loggedUser.profile.firstName,
            lastName: loggedUser.profile.lastName,
            signatureImageUrl: null,
          });
          if (!isCurrentSession(generation)) return false;
          removeLegacyAdminSignature();
          return true;
        } catch {
          // The profile mutation already reports the error to the user.
          return false;
        }
      }

      setIsSaving(true);

      try {
        const signatureUrl = await uploadUserSignature(file);
        if (!signatureUrl || !isCurrentSession(generation)) return false;

        const updatedUser = {
          ...loggedUser!,
          profile: { ...loggedUser!.profile!, signatureImageUrl: signatureUrl },
        };
        updateLoggedUser(updatedUser);
        queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
        return true;
      } catch {
        // The upload hook already reports the error to the user.
        return false;
      } finally {
        if (isCurrentSession(generation)) setIsSaving(false);
      }
    },
    [loggedUser, uploadUserSignature, updateLoggedUser, queryClient, updateProfileAsync],
  );

  return {
    adminSignatureDataUrl,
    adminSignatureDisplayUrl,
    setAdminSignatureDataUrl,
    isUploadingAdminSignature: isUploading || isSaving || isUpdatingProfile,
  };
}
