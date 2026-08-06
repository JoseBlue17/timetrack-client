import { Routes, Route, Navigate } from 'react-router-dom';
import { useVerifyToken } from '@/hooks/use-verify-token';
import { useCanEditConfiguration, useIsSupervisor } from '@/hooks/use-user-role';
import useLoggedUser from '@/hooks/use-logged-user';
import { SignInPage } from '@/modules/sign-in';
import { SignUpPage } from '@/modules/sign-up';
import { TimesheetsPage } from '@/modules/timesheets';
import { SettingsPage } from '@/modules/settings';
import { ReportsPage } from '@/modules/reports';
import { PaymentsPage } from '@/modules/payments';
import { AppLayout } from '@/components/layout/app-layout';

function App() {
  const { isVerifyingToken } = useVerifyToken();
  const { loggedUser } = useLoggedUser();
  const isAdmin = useCanEditConfiguration();
  const isSupervisor = useIsSupervisor();
  const canViewReports = isAdmin || isSupervisor;

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
        path="/sign-in"
        element={loggedUser ? <Navigate to="/timesheets" replace /> : <SignInPage />}
      />
      <Route
        path="/sign-up"
        element={loggedUser ? <Navigate to="/timesheets" replace /> : <SignUpPage />}
      />

      <Route element={loggedUser ? <AppLayout /> : <Navigate to="/sign-in" replace />}>
        <Route path="/" element={<Navigate to="/timesheets" replace />} />
        <Route path="/timesheets" element={<TimesheetsPage />} />
        <Route
          path="/reportes"
          element={canViewReports ? <ReportsPage /> : <Navigate to="/timesheets" replace />}
        />
        <Route
          path="/pagos"
          element={isAdmin ? <PaymentsPage /> : <Navigate to="/timesheets" replace />}
        />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
