export function isValidDataUrl(url: string): boolean {
  return /^data:image\/[a-zA-Z]+;base64,/.test(url);
}
