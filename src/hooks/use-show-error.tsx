import { useMemo } from 'react';
import { useToast } from './use-toast';
import type { AxiosResponseError } from '@/config/http';
import { getHttpErrorMessage } from '@/config/http/error';

export const useShowError = () => {
  const { triggerToast } = useToast();

  const showError = useMemo(
    () => (error: AxiosResponseError) => {
      triggerToast({
        title: getHttpErrorMessage(error),
        type: 'error',
      });
    },
    [triggerToast],
  );

  return { showError };
};
