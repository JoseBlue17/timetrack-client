import type { Rule } from 'antd/es/form';

export const REQUIRED = (message: string): Rule => ({ required: true, message });

export const EMAIL = (requiredMessage = 'El correo es requerido'): Rule[] => [
  { required: true, message: requiredMessage },
  { type: 'email', message: 'Ingresa un correo válido' },
];

export const PASSWORD = (requiredMessage = 'La contraseña es requerida'): Rule[] => [
  { required: true, message: requiredMessage },
  { min: 6, message: 'Mínimo 6 caracteres' },
];
