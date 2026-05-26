import * as Yup from 'yup';

export const profileSettingsSchema = Yup.object({
  firstName: Yup.string().required('El nombre es requerido'),
  lastName: Yup.string().required('El apellido es requerido'),
  position: Yup.string().required('El puesto de trabajo es requerido'),
  email: Yup.string().email('Correo electrónico inválido').required('El correo es requerido'),
});
