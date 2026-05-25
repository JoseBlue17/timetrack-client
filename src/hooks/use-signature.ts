import { useState } from 'react';

const SIGNATURE_KEY = 'timetrack_signature';

export function useSignature() {
  const [signatureDataUrl, setSignatureDataUrlState] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(SIGNATURE_KEY);
    }
    return null;
  });

  const setSignatureDataUrl = (dataUrl: string | null) => {
    setSignatureDataUrlState(dataUrl);
    if (dataUrl) {
      localStorage.setItem(SIGNATURE_KEY, dataUrl);
    } else {
      localStorage.removeItem(SIGNATURE_KEY);
    }
  };

  return { signatureDataUrl, setSignatureDataUrl };
}
