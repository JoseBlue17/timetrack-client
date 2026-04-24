import type { SignInValues } from './sign-in.interface';

export const signInInitialValues: SignInValues = {
  email: '',
  password: '',
  rememberMe: false,
};

export const demoAccounts = {
  employee: {
    email: 'employee@timetrack.com',
    password: 'demo1234',
  },
  admin: {
    email: 'admin@timetrack.com',
    password: 'demo1234',
  },
};
