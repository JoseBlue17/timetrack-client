import { useState } from 'react';

const SELECTED_SUPERVISOR_KEY = 'timetrack_selected_supervisor';

export function useSelectedSupervisor() {
  const [selectedSupervisorId, setSelectedSupervisorIdState] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(SELECTED_SUPERVISOR_KEY);
    }
    return null;
  });

  const setSelectedSupervisorId = (supervisorId: string | null) => {
    setSelectedSupervisorIdState(supervisorId);
    if (supervisorId) {
      localStorage.setItem(SELECTED_SUPERVISOR_KEY, supervisorId);
    } else {
      localStorage.removeItem(SELECTED_SUPERVISOR_KEY);
    }
  };

  return { selectedSupervisorId, setSelectedSupervisorId };
}
