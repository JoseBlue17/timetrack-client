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
