import { useCallback, useEffect, useMemo, useState } from 'react';

import { useSignature } from '@/hooks';
import { useSignatureDisplayUrl } from './use-signature-display-url';

export function useSignatureDraft() {
  const { signatureUrl, setSignature, isUploading } = useSignature();
  const signedSignatureUrl = useSignatureDisplayUrl(signatureUrl);

  const [pendingSignature, setPendingSignature] = useState<File | null | undefined>(undefined);
  const [pendingSignatureUrl, setPendingSignatureUrl] = useState<string | null>(null);

  useEffect(
    () => () => {
      if (pendingSignatureUrl) URL.revokeObjectURL(pendingSignatureUrl);
    },
    [pendingSignatureUrl],
  );

  const displaySignatureUrl =
    pendingSignature !== undefined ? pendingSignatureUrl : signedSignatureUrl;

  const hasChanges = pendingSignature !== undefined;

  const handleChange = useCallback(
    (file: File | null) => {
      if (pendingSignatureUrl) URL.revokeObjectURL(pendingSignatureUrl);

      setPendingSignature(file);
      setPendingSignatureUrl(file ? URL.createObjectURL(file) : null);
    },
    [pendingSignatureUrl],
  );

  const handleSave = useCallback(async () => {
    await setSignature(pendingSignature!);

    if (pendingSignatureUrl) URL.revokeObjectURL(pendingSignatureUrl);

    setPendingSignature(undefined);
    setPendingSignatureUrl(null);
  }, [pendingSignature, pendingSignatureUrl, setSignature]);

  return useMemo(
    () => ({
      signatureUrl: displaySignatureUrl,
      isSaving: isUploading,
      hasChanges,
      onChange: handleChange,
      onSave: handleSave,
    }),
    [displaySignatureUrl, handleChange, handleSave, hasChanges, isUploading],
  );
}
