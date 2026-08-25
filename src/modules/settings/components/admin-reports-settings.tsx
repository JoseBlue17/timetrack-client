import { SignatureUpload } from './signature-upload';
import { useAdminSignature } from '@/hooks';
import { fileToDataUrl } from '@/tools/file-to-data-url';

export function AdminReportsSettings() {
  const { adminSignatureDataUrl, setAdminSignatureDataUrl } = useAdminSignature();

  const handleSignatureChange = async (file: File | null) => {
    if (!file) {
      setAdminSignatureDataUrl(null);
      return;
    }

    const dataUrl = await fileToDataUrl(file);
    setAdminSignatureDataUrl(dataUrl);
  };

  return (
    <SignatureUpload
      title="Firma de aprobación"
      description="Esta firma se adjuntará por defecto al aprobar reportes"
      signatureUrl={adminSignatureDataUrl}
      onChange={handleSignatureChange}
    />
  );
}
