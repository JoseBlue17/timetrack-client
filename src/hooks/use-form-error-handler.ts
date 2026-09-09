import { useCallback } from 'react';
import type { FormInstance } from 'antd';
import type { HttpError } from '@/config/http';
import { getHttpFieldErrors } from '@/config/http/error';

export function useFormErrorHandler(form: FormInstance) {
  return useCallback(
    (error: HttpError) => {
      const fieldErrors = getHttpFieldErrors(error);
      if (fieldErrors.length === 0) return;

      form.setFields(
        fieldErrors.map(({ name, errors }) => ({
          name,
          errors,
        })),
      );
    },
    [form],
  );
}
