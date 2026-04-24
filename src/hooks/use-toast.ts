import { toast } from 'sonner';
import type { IToastOptions } from './hooks.interface';

export function useToast() {
  const triggerToast = ({ title, description, type = 'info' }: IToastOptions) => {
    const message = description ? `${title}: ${description}` : title;
    toast[type](message);
  };

  return { triggerToast };
}
