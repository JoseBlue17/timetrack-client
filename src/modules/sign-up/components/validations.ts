import * as Yup from 'yup';

export const signUpValidationSchema = Yup.object({
  firstName: Yup.string().min(2, 'Mínimo 2 caracteres').required('El nombre es requerido'),
  lastName: Yup.string().min(2, 'Mínimo 2 caracteres').required('El apellido es requerido'),
  email: Yup.string().email('Ingresa un correo válido').required('El correo es requerido'),
  password: Yup.string().min(6, 'Mínimo 6 caracteres').required('La contraseña es requerida'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña'),
});
