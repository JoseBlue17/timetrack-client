import { useState } from 'react';

const ADMIN_SIGNATURE_KEY = 'timetrack_admin_signature';

export function useAdminSignature() {
  const [adminSignatureDataUrl, setAdminSignatureDataUrlState] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(ADMIN_SIGNATURE_KEY);
    }
    return null;
  });

  const setAdminSignatureDataUrl = (dataUrl: string | null) => {
    setAdminSignatureDataUrlState(dataUrl);
    if (dataUrl) {
      localStorage.setItem(ADMIN_SIGNATURE_KEY, dataUrl);
    } else {
      localStorage.removeItem(ADMIN_SIGNATURE_KEY);
    }
  };

  return { adminSignatureDataUrl, setAdminSignatureDataUrl };
}
