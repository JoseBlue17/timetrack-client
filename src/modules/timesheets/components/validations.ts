import * as Yup from 'yup';

const timesheetEntrySchema = Yup.object({
  project: Yup.string().max(100).required('Requerido'),
  description: Yup.string().max(500).required('Requerido'),
  hours: Yup.number().min(0.25).max(24).nullable().required('Requerido'),
});

const timesheetEntriesSchema = Yup.array().of(timesheetEntrySchema);

export const timesheetFormSchema = Yup.object({
  date: Yup.string().required('La fecha es requerida'),
  entries: timesheetEntriesSchema.required('Requerido'),
});
