import { useState } from 'react';

const HOURLY_RATE_KEY = 'timetrack_hourly_rate';

export function useHourlyRate() {
  const [hourlyRate, setHourlyRateState] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const storedRate = localStorage.getItem(HOURLY_RATE_KEY);
      return storedRate ? Number(storedRate) : 0;
    }
    return 0;
  });

  const setHourlyRate = (rate: number | null) => {
    const validRate = rate || 0;
    setHourlyRateState(validRate);
    localStorage.setItem(HOURLY_RATE_KEY, validRate.toString());
  };

  return { hourlyRate, setHourlyRate };
}
