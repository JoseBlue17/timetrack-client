import type { ITimesheet, ITimesheetDateGroup } from './timesheet.interface';

const getDateKey = (date: string) => date.slice(0, 10);

export function groupTimesheetsByDate(timesheets: ITimesheet[]): ITimesheetDateGroup[] {
  const timesheetsByDate = timesheets.reduce<Map<string, ITimesheet[]>>(
    (accumulator, timesheet) => {
      const dateKey = getDateKey(timesheet.date);
      const existingList = accumulator.get(dateKey) ?? [];
      accumulator.set(dateKey, [...existingList, timesheet]);
      return accumulator;
    },
    new Map<string, ITimesheet[]>(),
  );

  return Array.from(timesheetsByDate.entries())
    .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
    .map(([date, items]) => {
      const uniqueProjectsCount = new Set(items.map((item) => item.project)).size;
      const totalHoursForDate = items.reduce((totalForDate, item) => totalForDate + item.hours, 0);

      return {
        date,
        projects: uniqueProjectsCount,
        totalHours: totalHoursForDate,
        timesheets: items,
      };
    });
}

export function sumTimesheetsHours(timesheets: ITimesheet[]): number {
  return timesheets.reduce((total, timesheet) => total + timesheet.hours, 0);
}

export function countUniqueTimesheetDays(timesheets: ITimesheet[]): number {
  return new Set(timesheets.map((timesheet) => getDateKey(timesheet.date))).size;
}
