// Known backend bucket (storage.config + AWS_S3_BUCKET/AWS_REGION).
const KNOWN_DOCUMENT_ORIGIN = 'https://digheondev.s3.us-east-1.amazonaws.com';

function httpsOrigin(value: string): string | undefined {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.origin : undefined;
  } catch {
    return undefined;
  }
}

export function getDocumentUrl(
  value: unknown,
  additionalOrigins: string[] = [
    import.meta.env.VITE_API_URL ?? '',
    ...(import.meta.env.VITE_DOCUMENT_ALLOWED_ORIGINS ?? '').split(','),
  ],
): string | undefined {
  if (typeof value !== 'string') return undefined;
  try {
    const url = new URL(value);
    const allowed = new Set([
      KNOWN_DOCUMENT_ORIGIN,
      ...additionalOrigins.map((origin) => httpsOrigin(origin.trim())).filter(Boolean),
    ]);
    if (url.protocol !== 'https:' || url.username || url.password || !allowed.has(url.origin))
      return undefined;
    return url.href;
  } catch {
    return undefined;
  }
}

export function requireDocumentUrl(value: unknown): string {
  const url = getDocumentUrl(value);
  if (!url) throw new Error('La URL del documento no está permitida.');
  return url;
}
