import type { AxiosResponseError } from '@/config/http';
import { useMemo } from 'react';
import { useToast } from './use-toast';

export const useShowError = () => {
  const { triggerToast } = useToast();

  const { byDomainCode, byHttpCode } = useMemo(
    () => ({
      byDomainCode: {
        INSUFFICIENT_CREDENTIALS_PROVIDED: 'Credenciales insuficientes',
        INVALID_CREDENTIALS: 'Contraseña o correo incorrectos',
        SESSION_TOKEN_EXPIRED: 'Sesión expirada, inicia sesión nuevamente',
        TOKEN_INVALID: 'El token es inválido',
        USER_ALREADY_REGISTERED: 'Este correo ya está registrado',
        FUTURE_PERIOD_NOT_ALLOWED: 'No se puede procesar un periodo futuro',
        REPORT_ALREADY_EXISTS: 'Ya existe un reporte para este periodo',
      } as Record<string, string>,
      byHttpCode: {
        400: 'Revisa los campos ingresados',
        401: 'No autorizado',
        403: 'No tienes permiso para realizar esta acción',
        404: 'Recurso no encontrado',
        500: 'Error interno del servidor',
      } as Record<number, string>,
    }),
    [],
  );

  const showError = (error: AxiosResponseError) => {
    const { response } = error;
    const { data, status: statusCode } = response || {};
    const errorCode = data?.code;

    let message: string | undefined;
    if (typeof errorCode === 'string') {
      message = byDomainCode[errorCode];
    } else if (statusCode) {
      message = byHttpCode[statusCode];
    }

    triggerToast({
      title: message ?? data?.message ?? error.message,
      type: 'error',
    });
  };

  return { showError };
};
