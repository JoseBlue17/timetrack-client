const HOURLY_RATE_KEY = 'timetrack_hourly_rate';

export function getStoredHourlyRate(): number {
  if (typeof window === 'undefined') {
    return 0;
  }
  const storedRate = localStorage.getItem(HOURLY_RATE_KEY);
  return storedRate ? Number(storedRate) : 0;
}

export function setStoredHourlyRate(rate: number): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(HOURLY_RATE_KEY, String(rate));
}
