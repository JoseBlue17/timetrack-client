import { useToast } from './use-toast';

interface IShowSuccess {
  title: string;
  description?: string;
}

export const useShowSuccess = () => {
  const { triggerToast } = useToast();

  const showSuccess = ({ title, description }: IShowSuccess) => {
    triggerToast({ title, description, type: 'success' });
  };

  return { showSuccess };
};
