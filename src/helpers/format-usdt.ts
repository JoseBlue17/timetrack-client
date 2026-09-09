export function formatUsdt(value = 0) {
  return `${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(value)} USDT`;
}
