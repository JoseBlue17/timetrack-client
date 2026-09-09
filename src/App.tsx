import { useVerifyToken } from '@/hooks/use-verify-token';
import { AppRoutes } from '@/routes';

function App() {
  const { isVerifyingToken } = useVerifyToken();

  if (isVerifyingToken) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-appBackground">
        <span className="text-primary-500 font-semibold">Cargando...</span>
      </div>
    );
  }

  return <AppRoutes />;
}

export default App;
