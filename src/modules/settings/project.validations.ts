import * as Yup from 'yup';

export const projectFormSchema = Yup.object({
  name: Yup.string().max(100, 'Máximo 100 caracteres').required('El nombre es requerido'),
  description: Yup.string().max(500, 'Máximo 500 caracteres').optional(),
});
