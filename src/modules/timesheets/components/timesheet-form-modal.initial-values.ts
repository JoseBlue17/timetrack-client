import dayjs from 'dayjs';
import type { ITimesheet, ITimesheetEntry, ITimesheetFormValues } from '../timesheet.interface';

export const createEmptyEntry = (): ITimesheetEntry => ({
  project: '',
  description: '',
  hours: null,
});

export const getTimesheetFormInitialValues = (timesheet?: ITimesheet): ITimesheetFormValues => ({
  date: timesheet ? timesheet.date.slice(0, 10) : dayjs().format('YYYY-MM-DD'),
  entries: timesheet
    ? [{ project: timesheet.project, description: timesheet.description, hours: timesheet.hours }]
    : [createEmptyEntry()],
});
