import { UserRole } from '@/enums';
import useLoggedUser from './use-logged-user';

export function useCanEditConfiguration(): boolean {
  const { loggedUser } = useLoggedUser();
  if (!loggedUser?.role) return false;
  const allowedRoles: UserRole[] = [UserRole.Admin, UserRole.SuperAdmin];
  return allowedRoles.includes(loggedUser.role as UserRole);
}
