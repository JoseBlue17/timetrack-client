const HOURLY_RATE_KEY = 'timetrack_hourly_rate';

export function getStoredHourlyRate(userId?: string): number {
  if (!userId || typeof window === 'undefined') return 0;
  const rate = Number(localStorage.getItem(`${HOURLY_RATE_KEY}:${userId}`));
  return Number.isFinite(rate) && rate >= 0 ? rate : 0;
}

export function setStoredHourlyRate(rate: number, userId?: string): void {
  if (!userId || typeof window === 'undefined') return;
  localStorage.setItem(`${HOURLY_RATE_KEY}:${userId}`, String(rate));
}
