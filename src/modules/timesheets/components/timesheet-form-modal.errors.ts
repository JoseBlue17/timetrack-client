import type { FormikErrors } from 'formik';
import type { ITimesheetEntry, ITimesheetFormValues } from './timesheet.interface';

export const getTimesheetEntryError = (params: {
  showErrors: boolean;
  errors: FormikErrors<ITimesheetFormValues>;
  entryIndex: number;
  field: keyof ITimesheetEntry;
}): string => {
  const { showErrors, errors, entryIndex, field } = params;
  if (!showErrors) return '';

  const entriesErrors = errors.entries;
  if (!Array.isArray(entriesErrors)) return '';

  const entryError = entriesErrors[entryIndex];
  if (!entryError || typeof entryError !== 'object') return '';

  const message = (entryError as Record<string, unknown>)[field];
  if (typeof message !== 'string') return '';

  return message;
};
