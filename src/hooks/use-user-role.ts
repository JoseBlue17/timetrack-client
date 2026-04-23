import { UserRole } from '@/enums';
import useLoggedUser from './use-logged-user';

export function useUserHasRole(allowedRoles: UserRole | UserRole[]): boolean {
  const { loggedUser } = useLoggedUser();

  if (!loggedUser?.role) return false;
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return roles.includes(loggedUser.role as UserRole);
}

export function useCanEditConfiguration(): boolean {
  return useUserHasRole([UserRole.Admin, UserRole.SuperAdmin]);
}
