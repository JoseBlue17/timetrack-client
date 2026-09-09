import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

import useLoggedUser from '@/hooks/use-logged-user';
import { useCurrentRole } from '@/hooks';
import { ROUTES } from '@/constants';
import { UserRole } from '@/enums';

interface GuardProps {
  children: ReactNode;
}

function getDefaultPrivateRoute(role: UserRole | undefined): string {
  if (role === UserRole.Admin) {
    return ROUTES.PAYMENTS;
  }

  if (role === UserRole.Supervisor) {
    return ROUTES.REPORTS;
  }

  return ROUTES.HOME;
}

export function PrivateRoute({ children }: GuardProps) {
  const { loggedUser } = useLoggedUser();

  if (!loggedUser) {
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  return <>{children}</>;
}

export function PublicRoute({ children }: GuardProps) {
  const { loggedUser } = useLoggedUser();
  const role = useCurrentRole();

  if (loggedUser) {
    return <Navigate to={getDefaultPrivateRoute(role)} replace />;
  }

  return <>{children}</>;
}

interface RoleRouteProps extends GuardProps {
  roles: readonly UserRole[];
  redirectTo?: string;
}

export function RoleRoute({ roles, redirectTo = ROUTES.TIMESHEETS, children }: RoleRouteProps) {
  const role = useCurrentRole();

  if (!role || !roles.includes(role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
