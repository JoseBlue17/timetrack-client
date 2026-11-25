export function openExternal(value: string): void {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password) return;
    window.open(url.href, '_blank', 'noopener,noreferrer');
  } catch {
    // Invalid destinations must not navigate.
  }
}
