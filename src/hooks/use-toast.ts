import { toast } from 'sonner';
import type { IToastOptions } from './hooks.interface';

function triggerToast({ title, description, type = 'info' }: IToastOptions) {
  const message = description ? `${title}: ${description}` : title;
  toast[type](message);
}

export function useToast() {
  return { triggerToast };
}
