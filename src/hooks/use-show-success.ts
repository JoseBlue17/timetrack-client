import { useToast } from './use-toast';
import type { IShowSuccessOptions } from './hooks.interface';

export const useShowSuccess = () => {
  const { triggerToast } = useToast();

  const showSuccess = ({ title, description }: IShowSuccessOptions) => {
    triggerToast({ title, description, type: 'success' });
  };

  return { showSuccess };
};
