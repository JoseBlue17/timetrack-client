import { SignatureUpload } from './signature-upload';
import { useAdminSignature } from '@/hooks';

export function AdminReportsSettings() {
  const { adminSignatureDataUrl, setAdminSignatureDataUrl } = useAdminSignature();

  return (
    <SignatureUpload
      title="Firma de aprobación"
      description="Esta firma se adjuntará por defecto al aprobar reportes"
      signatureDataUrl={adminSignatureDataUrl}
      onChange={setAdminSignatureDataUrl}
    />
  );
}
