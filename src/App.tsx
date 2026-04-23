import { Routes, Route, Navigate } from 'react-router-dom';
import { useVerifyToken } from '@/hooks/use-verify-token';
import useLoggedUser from '@/hooks/use-logged-user';

function App() {
  const { isVerifyingToken } = useVerifyToken();
  const { loggedUser } = useLoggedUser();

  if (isVerifyingToken) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-appBackground">
        <span className="text-primary-500 font-semibold">Cargando...</span>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route
        path="/sign-in"
        element={loggedUser ? <Navigate to="/" replace /> : <div>Sign In Page (por construir)</div>}
      />

      {/* Rutas protegidas */}
      <Route
        path="/"
        element={
          loggedUser ? (
            <div className="min-h-screen bg-appBackground p-8">
              <h1 className="text-2xl font-bold text-primary-500">TimeTrack Client</h1>
              <p className="mt-2 text-slate-600">Hola, {loggedUser.profile.firstName} 👋</p>
            </div>
          ) : (
            <Navigate to="/sign-in" replace />
          )
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
