import { UserRole } from '@/enums';
import useLoggedUser from './use-logged-user';

const ALLOWED_ROLES: UserRole[] = [UserRole.Admin, UserRole.SuperAdmin];

export function useCanEditConfiguration(): boolean {
  const { loggedUser } = useLoggedUser();
  if (!loggedUser?.role) return false;
  return ALLOWED_ROLES.includes(loggedUser.role as UserRole);
}
