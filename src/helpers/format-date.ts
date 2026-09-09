export function formatDate(date?: string) {
  if (!date) return 'Fecha pendiente';

  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}
