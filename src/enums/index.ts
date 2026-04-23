export const Language = {
  English: 'en',
  Spanish: 'es',
} as const;
export type Language = (typeof Language)[keyof typeof Language];

export const DEFAULT_LANGUAGE = 'es' as const;

export const HttpErrorCodesEnum = {
  UNAUTHORIZED: 401,
} as const;
export type HttpErrorCodesEnum = (typeof HttpErrorCodesEnum)[keyof typeof HttpErrorCodesEnum];

export const UserRole = {
  Admin: 'admin',
  Basic: 'basic',
  SuperAdmin: 'superAdmin',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserStatus = {
  Active: 'active',
  Inactive: 'inactive',
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
