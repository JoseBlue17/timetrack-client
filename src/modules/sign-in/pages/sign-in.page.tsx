import { SignInForm } from '../components/sign-in-form';
import { useSignIn } from '../hooks/use-sign-in';

export function SignInPage() {
  const { signIn, isPending } = useSignIn();

  return (
    <main className="relative min-h-screen flex flex-col bg-[url('/fondo-1.jpg.jpeg')] px-4 py-10">
      <div className="absolute inset-0 pointer-events-none" />
      <section className="relative z-10 flex-1 flex items-center justify-center w-full">
        <article className="flex flex-col md:flex-row w-full max-w-5xl rounded-2xl shadow-card overflow-hidden">
          <section className="flex md:w-5/12 flex-col items-center justify-center bg-surface p-10 md:p-12 border-b md:border-b-0 md:border-r border-gray-200">
            <figure className="flex flex-col items-center text-center">
              <img
                src="/LOGO.jpg.jpeg"
                alt="TimeTrack"
                className="h-40 md:h-50 w-auto object-contain mb-8"
              />
              <figcaption>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Bienvenido a TimeTrack</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Plataforma de gestión de timesheets
                </p>
                <p className="text-slate-600 text-sm leading-relaxed">y pagos en USDT</p>
              </figcaption>
            </figure>
          </section>

          <section className="flex md:w-7/12 flex-col justify-center bg-white p-10 md:p-12">
            <header className="mb-8">
              <h2 className="text-2xl mt-14 font-bold text-slate-800">Iniciar sesión</h2>
              <p className="text-sm text-slate-600 mt-2">Ingresa tus credenciales para acceder</p>
            </header>
            <SignInForm onSubmit={signIn} isPending={isPending} />
          </section>
        </article>
      </section>

      <footer className="relative z-10 text-center mt-auto pt-10">
        <h2 className="text-2xl font-bold text-surface">TimeTrack</h2>
        <p className="text-sm text-slate-400 mt-1">
          © 2026 TimeTrack. Todos los derechos reservados.
        </p>
      </footer>
    </main>
  );
}
