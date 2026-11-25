import { useCallback, useState } from 'react';
import useLoggedUser from './use-logged-user';
import { getStoredHourlyRate, setStoredHourlyRate } from '@/helpers/hourly-rate-storage';

export function useHourlyRate() {
  const { loggedUser } = useLoggedUser();
  const userId = loggedUser?.id || loggedUser?._id;
  const [local, setLocal] = useState<{ userId?: string; rate: number }>();
  const localRate = local?.userId === userId ? (local?.rate ?? 0) : getStoredHourlyRate(userId);
  const hourlyRate = loggedUser?.profile?.hourlyRate ?? localRate;

  const setHourlyRate = useCallback(
    (rate: number | null) => {
      if (!userId) return;
      const validRate = rate !== null && Number.isFinite(rate) && rate >= 0 ? rate : 0;
      setLocal({ userId, rate: validRate });
      setStoredHourlyRate(validRate, userId);
    },
    [userId],
  );

  return { hourlyRate, setHourlyRate };
}
