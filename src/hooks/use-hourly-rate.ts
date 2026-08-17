import { useCallback, useMemo, useState } from 'react';

import useLoggedUser from './use-logged-user';
import { getStoredHourlyRate, setStoredHourlyRate } from '@/helpers/hourly-rate-storage';

function resolveHourlyRate(profileRate: number | undefined, localRate: number): number {
  return typeof profileRate === 'number' ? profileRate : localRate;
}

export function useHourlyRate() {
  const { loggedUser } = useLoggedUser();
  const profileHourlyRate = loggedUser?.profile?.hourlyRate;
  const [localRate, setLocalRate] = useState<number>(() => getStoredHourlyRate());

  const hourlyRate = useMemo(
    () => resolveHourlyRate(profileHourlyRate, localRate),
    [profileHourlyRate, localRate],
  );

  const setHourlyRate = useCallback((rate: number | null) => {
    const validRate = rate || 0;
    setLocalRate(validRate);
    setStoredHourlyRate(validRate);
  }, []);

  return { hourlyRate, setHourlyRate };
}
