import { useState } from 'react';
import { useDeleteTimesheet } from '../hooks/use-delete-timesheet';

export function useTimesheetsTable() {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const { mutate: deleteTimesheet, isPending: isDeleting } = useDeleteTimesheet();

  const handleToggleExpand = (date: string) => {
    setExpandedKeys((previousKeys) => {
      if (previousKeys.includes(date)) {
        return previousKeys.filter((key) => key !== date);
      }
      return [...previousKeys, date];
    });
  };

  return {
    expandedKeys,
    setExpandedKeys,
    deleteTimesheet,
    isDeleting,
    handleToggleExpand,
  };
}
