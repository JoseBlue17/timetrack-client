import { useState, useCallback, useMemo } from 'react';
import type { ITimesheet } from '../components/timesheet.interface';

export function useTimesheetModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<ITimesheet | undefined>(undefined);

  const handleEdit = useCallback((timesheet: ITimesheet) => {
    setSelectedTimesheet(timesheet);
    setModalOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setSelectedTimesheet(undefined);
    setModalOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setModalOpen(false);
    setSelectedTimesheet(undefined);
  }, []);

  return useMemo(
    () => ({
      modalOpen,
      selectedTimesheet,
      handleEdit,
      handleAdd,
      handleClose,
    }),
    [handleAdd, handleClose, handleEdit, modalOpen, selectedTimesheet],
  );
}
