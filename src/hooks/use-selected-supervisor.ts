import { useState } from 'react';
import useLoggedUser from './use-logged-user';

const SELECTED_SUPERVISOR_KEY = 'timetrack_selected_supervisor';

export function useSelectedSupervisor() {
  const { loggedUser } = useLoggedUser();
  const userId = loggedUser?.id || loggedUser?._id;
  const [selection, setSelection] = useState<{ userId: string; value: string | null }>();
  const key = userId ? `${SELECTED_SUPERVISOR_KEY}:${userId}` : null;
  const selectedSupervisorId =
    userId && key
      ? selection?.userId === userId
        ? selection.value
        : localStorage.getItem(key)
      : null;

  const setSelectedSupervisorId = (supervisorId: string | null) => {
    if (!userId || !key) return;
    setSelection({ userId, value: supervisorId });
    if (supervisorId) localStorage.setItem(key, supervisorId);
    else localStorage.removeItem(key);
  };

  return { selectedSupervisorId, setSelectedSupervisorId };
}
