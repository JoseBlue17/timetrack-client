import { useCallback, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import useLoggedUser from './use-logged-user';
import { useUploadToS3 } from './use-upload-to-s3';
import { useShowSuccess } from './use-show-success';
import { USER_PROFILE_QUERY_KEY } from '@/query-keys';
import { useUpdateProfile } from './use-update-profile';
import { getSessionGeneration, isCurrentSession } from '@/helpers/auth-session';

const LEGACY_SIGNATURE_KEY = 'timetrack_signature';

function removeLegacySignature(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LEGACY_SIGNATURE_KEY);
}

export function useSignature() {
  const { loggedUser, updateLoggedUser } = useLoggedUser();
  const { uploadUserSignature, isUploading } = useUploadToS3();
  const { showSuccess } = useShowSuccess();
  const [isSaving, setIsSaving] = useState(false);
  const { updateProfileAsync, isUpdatingProfile } = useUpdateProfile();
  const queryClient = useQueryClient();

  const signatureUrl = useMemo(
    () => loggedUser?.profile?.signatureImageUrl ?? null,
    [loggedUser?.profile?.signatureImageUrl],
  );

  const setSignature = useCallback(
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
          removeLegacySignature();
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
        showSuccess({
          title: 'Firma guardada',
          description: 'Firma digital actualizada correctamente',
        });
        return true;
      } catch {
        // The upload hook already reports the error to the user.
        return false;
      } finally {
        if (isCurrentSession(generation)) setIsSaving(false);
      }
    },
    [
      loggedUser,
      uploadUserSignature,
      updateLoggedUser,
      queryClient,
      updateProfileAsync,
      showSuccess,
    ],
  );

  return { signatureUrl, setSignature, isUploading: isUploading || isSaving || isUpdatingProfile };
}
