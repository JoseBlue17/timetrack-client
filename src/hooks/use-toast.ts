import { useState } from 'react';

interface ToastOptions {
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info';
}

export function useToast() {
  const [toasts, setToasts] = useState<(ToastOptions & { id: number })[]>([]);

  const triggerToast = (options: ToastOptions) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...options, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return { toasts, triggerToast };
}
