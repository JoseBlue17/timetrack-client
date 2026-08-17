import dayjs from 'dayjs';
import type { ITimesheet, ITimesheetEntry } from '../components/timesheet.interface';

export const createEmptyEntry = (): ITimesheetEntry => ({
  project: '',
  description: '',
  hours: null,
});

export const getTimesheetFormInitialValues = (
  timesheet?: Pick<ITimesheet, 'date' | 'project' | 'description' | 'hours'>,
): { date: dayjs.Dayjs; entries: ITimesheetEntry[] } => ({
  date: timesheet ? dayjs(timesheet.date.slice(0, 10)) : dayjs(),
  entries: timesheet
    ? [{ project: timesheet.project, description: timesheet.description, hours: timesheet.hours }]
    : [createEmptyEntry()],
});

export const formatTimesheetDate = (date: dayjs.Dayjs): string => date.format('YYYY-MM-DD');

export const toCreateTimesheetPayload = (date: string, entry: ITimesheetEntry) => ({
  date,
  project: entry.project,
  description: entry.description,
  hours: entry.hours ?? 0,
});

export const toUpdateTimesheetPayload = (date: string, entry: ITimesheetEntry) => ({
  date,
  project: entry.project,
  description: entry.description,
  hours: entry.hours ?? 0,
});

export const validateTimesheetEntries = async (_: unknown, entries: ITimesheetEntry[]) => {
  if (!entries || entries.length === 0) {
    return Promise.reject(new Error('Debes agregar al menos un proyecto'));
  }
  return Promise.resolve();
};
