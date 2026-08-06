import { UserRole } from '@/enums';
import useLoggedUser from './use-logged-user';

export function useCurrentRole(): UserRole | undefined {
  const { loggedUser } = useLoggedUser();
  return loggedUser?.role as UserRole | undefined;
}

export function useCanEditConfiguration(): boolean {
  const role = useCurrentRole();
  return role === UserRole.Admin;
}

export function useIsSupervisor(): boolean {
  const role = useCurrentRole();
  return role === UserRole.Supervisor;
}

export function useIsEmployee(): boolean {
  const role = useCurrentRole();
  return role === UserRole.Employee;
}
