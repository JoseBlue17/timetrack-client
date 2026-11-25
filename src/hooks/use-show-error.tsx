import { useMemo } from 'react';
import { isCancel } from 'axios';
import { useToast } from './use-toast';
import type { AxiosResponseError } from '@/config/http';
import { getHttpErrorMessage } from '@/config/http/error';

export const useShowError = () => {
  const { triggerToast } = useToast();

  const showError = useMemo(
    () => (error: AxiosResponseError) => {
      if (isCancel(error)) return;
      triggerToast({
        title: getHttpErrorMessage(error),
        type: 'error',
      });
    },
    [triggerToast],
  );

  return { showError };
};
