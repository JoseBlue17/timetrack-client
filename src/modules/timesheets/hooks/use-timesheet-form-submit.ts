import { useCallback } from 'react';
import type dayjs from 'dayjs';
import type { FormInstance } from 'antd';
import type { ITimesheet, ITimesheetEntry } from '../components/timesheet.interface';
import type { useCreateTimesheet } from './use-create-timesheet';
import type { useUpdateTimesheet } from './use-update-timesheet';
import {
  createEmptyEntry,
  formatTimesheetDate,
  toCreateTimesheetPayload,
  toUpdateTimesheetPayload,
} from '../components/timesheet-form.utils';

type CreateTimesheet = ReturnType<typeof useCreateTimesheet>['mutate'];
type UpdateTimesheet = ReturnType<typeof useUpdateTimesheet>['mutate'];

interface UseTimesheetFormSubmitParams {
  form: FormInstance;
  timesheet?: ITimesheet;
  createTimesheet: CreateTimesheet;
  updateTimesheet: UpdateTimesheet;
  onClose: () => void;
}

export function useTimesheetFormSubmit({
  form,
  timesheet,
  createTimesheet,
  updateTimesheet,
  onClose,
}: UseTimesheetFormSubmitParams) {
  const isEditing = !!timesheet;

  const closeModal = useCallback(() => {
    form.resetFields();
    onClose();
  }, [form, onClose]);

  return useCallback(
    (values: { date: dayjs.Dayjs; entries: ITimesheetEntry[] }) => {
      const date = formatTimesheetDate(values.date);

      if (isEditing) {
        const entryToUpdate = values.entries[0] ?? createEmptyEntry();
        updateTimesheet(toUpdateTimesheetPayload(date, entryToUpdate), { onSuccess: closeModal });
        return;
      }

      let completedCount = 0;
      const totalCount = values.entries.length;

      values.entries.forEach((entryToCreate) => {
        createTimesheet(toCreateTimesheetPayload(date, entryToCreate), {
          onSuccess: () => {
            completedCount += 1;
            if (completedCount === totalCount) closeModal();
          },
        });
      });
    },
    [isEditing, createTimesheet, updateTimesheet, closeModal],
  );
}
