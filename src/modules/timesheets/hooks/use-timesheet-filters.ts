import { useState, useMemo } from 'react';
import dayjs from 'dayjs';

export type TimesheetTab = 'active' | 'history' | 'old-reports';

export function useTimesheetFilters() {
  const [activeTab, setActiveTab] = useState<TimesheetTab>('active');
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const currentMonth = Number(selectedDate.format('MM'));
  const currentYear = Number(selectedDate.format('YYYY'));

  return useMemo(
    () => ({
      activeTab,
      setActiveTab,
      selectedDate,
      setSelectedDate,
      currentMonth,
      currentYear,
    }),
    [activeTab, currentMonth, currentYear, selectedDate],
  );
}
