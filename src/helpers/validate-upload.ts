export const MAX_SIGNATURE_BYTES = 5 * 1024 * 1024;
export const MAX_REPORT_PDF_BYTES = 100 * 1024 * 1024;

// Client-side defense in depth. Server must independently inspect file contents.
export function validateUpload(file: File, kind: 'signature' | 'report-pdf'): void {
  const types = kind === 'signature' ? ['image/png', 'image/jpeg'] : ['application/pdf'];
  const maximum = kind === 'signature' ? MAX_SIGNATURE_BYTES : MAX_REPORT_PDF_BYTES;
  if (!types.includes(file.type))
    throw new Error(
      kind === 'signature' ? 'La firma debe ser PNG o JPEG.' : 'El reporte debe ser PDF.',
    );
  if (file.size <= 0 || file.size > maximum)
    throw new Error(`El archivo debe tener contenido y no superar ${maximum / (1024 * 1024)} MiB.`);
}
