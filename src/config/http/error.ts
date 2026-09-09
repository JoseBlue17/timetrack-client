import type { HttpError, HttpFieldError } from './index';

const DOMAIN_ERROR_MESSAGES: Record<string, string> = {
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
};

const HTTP_ERROR_MESSAGES: Record<number, string> = {
  400: 'Revisa los campos ingresados',
  401: 'No autorizado',
  403: 'No tienes permiso para realizar esta acción',
  404: 'Recurso no encontrado',
  500: 'Error interno del servidor',
};

export function getHttpErrorMessage(error: HttpError): string {
  const { response } = error;
  const { data, status } = response || {};
  const errorCode = data?.code;

  if (typeof errorCode === 'string') {
    const domainMessage = DOMAIN_ERROR_MESSAGES[errorCode];
    if (domainMessage) return domainMessage;
  }

  if (status && HTTP_ERROR_MESSAGES[status]) return HTTP_ERROR_MESSAGES[status];

  return data?.message || error.message;
}

export function getHttpFieldErrors(error: HttpError): HttpFieldError[] {
  const { response } = error;
  const { data } = response || {};

  if (Array.isArray(data?.fieldErrors) && data.fieldErrors.length > 0) {
    return data.fieldErrors;
  }

  if (data?.name && typeof data.name === 'object') {
    return Object.entries(data.name).map(([name, message]) => ({ name, errors: [message] }));
  }

  return [];
}
