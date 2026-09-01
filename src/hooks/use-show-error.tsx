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
        INVALID_HOURLY_RATE: 'El costo por hora debe ser mayor a 0',
        EMPLOYEE_WALLET_REQUIRED: 'Necesitas una wallet activa para cerrar el mes',
        INVALID_SUPERVISOR: 'El supervisor seleccionado no es válido',
        NO_TIMESHEETS_FOUND: 'No hay registros de tiempo para este periodo',
        TIMESHEET_NOT_FOUND: 'Registro de tiempo no encontrado',
        UNAUTHORIZED_TIMESHEET_ACCESS: 'No tienes permiso para este registro',
        TIMESHEET_CREATION_FAILED: 'No se pudo crear el registro',
        TIMESHEET_UPDATE_FAILED: 'No se pudo actualizar el registro',
        TIMESHEET_DELETE_FAILED: 'No se pudo eliminar el registro',
        SIGN_FAILED: 'No se pudo firmar el registro',
        UNAUTHORIZED: 'No autorizado',
        INVALID_STATUS: 'Estado no válido para esta acción',
        NO_REPORT_FOUND: 'Reporte no encontrado',
        SUPERVISOR_REQUIRED: 'El supervisor es requerido',
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
