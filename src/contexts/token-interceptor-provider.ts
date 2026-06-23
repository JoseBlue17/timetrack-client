// El token de autenticación ahora se envía automáticamente como cookie HttpOnly.
// Este componente ya no necesita inyectar el header Authorization manualmente.
export function TokenInterceptorProvider() {
  return null;
}
