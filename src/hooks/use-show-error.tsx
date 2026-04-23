import type { AxiosResponseError } from '@/config/http';
import { useMemo } from 'react';

export const useShowError = () => {
  const { byDomainCode, byHttpCode } = useMemo(
    () => ({
      byDomainCode: {
        INSUFFICIENT_CREDENTIALS_PROVIDED: 'Credenciales insuficientes',
        INVALID_CREDENTIALS: 'Contraseña actual incorrecta',
        SESSION_TOKEN_EXPIRED: 'Token de sesión ha expirado',
        TOKEN_INVALID: 'El token es inválido.',
        USER_ALREADY_REGISTERED: 'Usuario ya registrado.',
      } as Record<string, string>,
      byHttpCode: {
        400: 'Revisa los campos',
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

    console.error(message ?? error.message);
    // Sustituir por tu sistema de notificaciones (toast, etc.)
    alert(message ?? error.message);
  };

  return { showError };
};
