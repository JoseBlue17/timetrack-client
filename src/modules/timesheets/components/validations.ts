import * as Yup from 'yup';

export const timesheetValidationSchema = Yup.object({
  date: Yup.string().required('La fecha es requerida'),
  project: Yup.string().max(100, 'Máximo 100 caracteres').required('El proyecto es requerido'),
  description: Yup.string()
    .max(500, 'Máximo 500 caracteres')
    .required('La descripción es requerida'),
  hours: Yup.number()
    .min(0.25, 'Mínimo 0.25 horas')
    .max(24, 'Máximo 24 horas')
    .required('Las horas son requeridas'),
  hourlyRate: Yup.number().min(0, 'No puede ser negativo').required('La tarifa es requerida'),
});

export const timesheetEntrySchema = Yup.object({
  project: Yup.string().max(100).required('Requerido'),
  description: Yup.string().max(500).required('Requerido'),
  hours: Yup.number().min(0.25).max(24).nullable().required('Requerido'),
});

export const timesheetEntriesSchema = Yup.array().of(timesheetEntrySchema);

export const timesheetFormSchema = Yup.object({
  date: Yup.string().required('La fecha es requerida'),
  entries: timesheetEntriesSchema.required('Requerido'),
});
