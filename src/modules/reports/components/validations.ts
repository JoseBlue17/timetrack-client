import * as Yup from 'yup';
import { isValidDataUrl } from '@/helpers/is-valid-data-url';

export const APPROVE_REPORT_SIGNATURE_REQUIRED =
  'Debes subir tu firma de aprobación en Configuración antes de aprobar reportes.';

export const approveReportSchema = Yup.object({
  adminSignatureDataUrl: Yup.string()
    .required(APPROVE_REPORT_SIGNATURE_REQUIRED)
    .test('is-valid-data-url', APPROVE_REPORT_SIGNATURE_REQUIRED, (value) =>
      value ? isValidDataUrl(value) : false,
    ),
});
