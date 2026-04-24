import type {
  ICreateTimesheetValues,
  ITimesheetEntry,
  ITimesheetFormValues,
  IUpdateTimesheetValues,
} from './timesheet.interface';

type MutationOptions = { onSuccess?: () => void };

type MutateFn<TValues> = (values: TValues, options?: MutationOptions) => void;

export const createTimesheetFormSubmit = (params: {
  isEditing: boolean;
  createTimesheet: MutateFn<ICreateTimesheetValues>;
  updateTimesheet: MutateFn<IUpdateTimesheetValues>;
  onClose: () => void;
  createEmptyEntry: () => ITimesheetEntry;
}) => {
  const { isEditing, createTimesheet, updateTimesheet, onClose, createEmptyEntry } = params;

  return (values: ITimesheetFormValues, helpers: { resetForm: () => void }) => {
    const closeModal = () => {
      helpers.resetForm();
      onClose();
    };

    if (isEditing) {
      const entryToUpdate = values.entries[0] ?? createEmptyEntry();
      updateTimesheet(
        {
          date: values.date,
          project: entryToUpdate.project,
          description: entryToUpdate.description,
          hours: entryToUpdate.hours ?? 0,
        },
        { onSuccess: closeModal },
      );
      return;
    }

    let completedCount = 0;
    const totalCount = values.entries.length;

    values.entries.forEach((entryToCreate) => {
      createTimesheet(
        {
          date: values.date,
          project: entryToCreate.project,
          description: entryToCreate.description,
          hours: entryToCreate.hours ?? 0,
          hourlyRate: 0,
        },
        {
          onSuccess: () => {
            completedCount += 1;
            if (completedCount === totalCount) closeModal();
          },
        },
      );
    });
  };
};
