import { Routes, Route, Navigate } from 'react-router-dom';

import { useVerifyToken } from '@/hooks/use-verify-token';
import { useCanEditConfiguration, useIsSupervisor } from '@/hooks/use-user-role';
import useLoggedUser from '@/hooks/use-logged-user';
import { ROUTES } from '@/constants';
import { SignInPage } from '@/modules/sign-in';
import { SignUpPage } from '@/modules/sign-up';
import { TimesheetsPage } from '@/modules/timesheets';
import { SettingsPage } from '@/modules/settings';
import { ReportsPage } from '@/modules/reports';
import { PaymentsPage } from '@/modules/payments';
import { DashboardPage } from '@/modules/dashboard';
import { AppLayout } from '@/components/layout/app-layout';

function App() {
  const { isVerifyingToken } = useVerifyToken();
  const { loggedUser } = useLoggedUser();
  const isAdmin = useCanEditConfiguration();
  const isSupervisor = useIsSupervisor();
  const canViewReports = isAdmin || isSupervisor;
  const defaultPrivateRoute = isAdmin
    ? ROUTES.PAYMENTS
    : isSupervisor
      ? ROUTES.REPORTS
      : ROUTES.HOME;

  if (isVerifyingToken) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-appBackground">
        <span className="text-primary-500 font-semibold">Cargando...</span>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path={ROUTES.SIGN_IN}
        element={loggedUser ? <Navigate to={defaultPrivateRoute} replace /> : <SignInPage />}
      />
      <Route
        path={ROUTES.SIGN_UP}
        element={loggedUser ? <Navigate to={defaultPrivateRoute} replace /> : <SignUpPage />}
      />

      <Route element={loggedUser ? <AppLayout /> : <Navigate to={ROUTES.SIGN_IN} replace />}>
        <Route
          path={ROUTES.HOME}
          element={
            !canViewReports ? <DashboardPage /> : <Navigate to={defaultPrivateRoute} replace />
          }
        />
        <Route path={ROUTES.TIMESHEETS} element={<TimesheetsPage />} />
        <Route
          path={ROUTES.REPORTS}
          element={canViewReports ? <ReportsPage /> : <Navigate to={ROUTES.TIMESHEETS} replace />}
        />
        <Route
          path={ROUTES.PAYMENTS}
          element={isAdmin ? <PaymentsPage /> : <Navigate to={ROUTES.TIMESHEETS} replace />}
        />
        <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}

export default App;
