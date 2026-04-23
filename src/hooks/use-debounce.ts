import { useCallback, useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function useDebounceFn<T extends (...args: unknown[]) => unknown>(fn: T, delay = 400) {
  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      const handler = setTimeout(() => fn(...args), delay);
      return () => clearTimeout(handler);
    },
    [fn, delay],
  );

  return debouncedFn;
}
