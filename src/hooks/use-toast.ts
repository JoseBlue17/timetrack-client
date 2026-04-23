import { toast } from 'sonner';

interface ToastOptions {
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

export function useToast() {
  const triggerToast = ({ title, description, type = 'info' }: ToastOptions) => {
    const message = description ? `${title}: ${description}` : title;
    toast[type](message);
  };

  return { triggerToast };
}
