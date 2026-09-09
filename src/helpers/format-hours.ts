export function formatHours(value = 0) {
  return `${new Intl.NumberFormat('es-ES', {
    maximumFractionDigits: 2,
  }).format(value)}h`;
}
