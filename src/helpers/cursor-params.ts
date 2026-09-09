export function cursorParams<T extends object = Record<string, unknown>>(
  cursor: string | undefined,
  base?: T,
): (T & { cursor: string }) | T | undefined {
  if (cursor) {
    return base ? { ...base, cursor } : ({ cursor } as T & { cursor: string });
  }
  return base && Object.keys(base).length > 0 ? base : undefined;
}
