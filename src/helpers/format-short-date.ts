export function formatShortDate(date?: Date | string): string {
  if (!date) return '--';
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}
