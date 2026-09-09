import { Routes, Route, Navigate } from 'react-router-dom';

import { useCanEditConfiguration, useIsSupervisor } from '@/hooks/use-user-role';
import { ROUTES } from '@/constants';
import { UserRole } from '@/enums';
import { SignInPage } from '@/modules/sign-in';
import { SignUpPage } from '@/modules/sign-up';
import { TimesheetsPage } from '@/modules/timesheets';
import { SettingsPage } from '@/modules/settings';
import { ReportsPage } from '@/modules/reports';
import { PaymentsPage } from '@/modules/payments';
import { DashboardPage } from '@/modules/dashboard';
import { AppLayout } from '@/components/layout/app-layout';
import { PrivateRoute, PublicRoute, RoleRoute } from './guards';

export function AppRoutes() {
  const isAdmin = useCanEditConfiguration();
  const isSupervisor = useIsSupervisor();
  const canViewReports = isAdmin || isSupervisor;
  const defaultPrivateRoute = isAdmin
    ? ROUTES.PAYMENTS
    : isSupervisor
      ? ROUTES.REPORTS
      : ROUTES.HOME;

  return (
    <Routes>
      <Route
        path={ROUTES.SIGN_IN}
        element={
          <PublicRoute>
            <SignInPage />
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.SIGN_UP}
        element={
          <PublicRoute>
            <SignUpPage />
          </PublicRoute>
        }
      />

      <Route
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route
          path={ROUTES.HOME}
          element={
            !canViewReports ? <DashboardPage /> : <Navigate to={defaultPrivateRoute} replace />
          }
        />
        <Route path={ROUTES.TIMESHEETS} element={<TimesheetsPage />} />
        <Route
          path={ROUTES.REPORTS}
          element={
            <RoleRoute roles={[UserRole.Admin, UserRole.Supervisor]}>
              <ReportsPage />
            </RoleRoute>
          }
        />
        <Route
          path={ROUTES.PAYMENTS}
          element={
            <RoleRoute roles={[UserRole.Admin]}>
              <PaymentsPage />
            </RoleRoute>
          }
        />
        <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}
