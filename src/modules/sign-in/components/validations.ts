import * as Yup from 'yup';

export const signInValidationSchema = Yup.object({
  email: Yup.string().email('Ingresa un correo válido').required('El correo es requerido'),
  password: Yup.string().min(6, 'Mínimo 6 caracteres').required('La contraseña es requerida'),
  rememberMe: Yup.boolean().default(false),
});
