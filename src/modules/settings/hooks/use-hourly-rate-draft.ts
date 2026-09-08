import { useCallback, useMemo, useState } from 'react';

import { useHourlyRate } from '@/hooks/use-hourly-rate';
import { useLoggedUser } from '@/hooks';
import { useUpdateProfile } from '@/hooks/use-update-profile';

export function useHourlyRateDraft() {
  const { hourlyRate, setHourlyRate } = useHourlyRate();
  const { loggedUser } = useLoggedUser();
  const { updateProfile, isUpdatingProfile } = useUpdateProfile();

  const [pendingHourlyRate, setPendingHourlyRate] = useState<number>(hourlyRate);
  const [previousHourlyRate, setPreviousHourlyRate] = useState<number>(hourlyRate);

  if (previousHourlyRate !== hourlyRate) {
    setPreviousHourlyRate(hourlyRate);
    setPendingHourlyRate(hourlyRate);
  }

  const hasChanges = pendingHourlyRate !== hourlyRate;

  const handleSave = useCallback(() => {
    setHourlyRate(pendingHourlyRate);

    if (!loggedUser) {
      return;
    }

    updateProfile({
      firstName: loggedUser.profile.firstName,
      lastName: loggedUser.profile.lastName,
      hourlyRate: pendingHourlyRate,
    });
  }, [loggedUser, pendingHourlyRate, setHourlyRate, updateProfile]);

  return useMemo(
    () => ({
      pendingHourlyRate,
      setPendingHourlyRate: (rate: number | null) => setPendingHourlyRate(rate ?? 0),
      hasChanges,
      isSaving: isUpdatingProfile,
      onSave: handleSave,
    }),
    [pendingHourlyRate, hasChanges, isUpdatingProfile, handleSave],
  );
}
