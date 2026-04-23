import { LuClock } from 'react-icons/lu';
import { SignUpForm } from '../components/sign-up-form';
import { useSignUp } from '../hooks/use-sign-up';

export function SignUpPage() {
  const { signUp, isPending } = useSignUp();

  return (
    <main className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-100 px-4 py-10">
      <section className="flex-1 flex flex-col items-center justify-center w-full">
        <header className="flex flex-col items-center gap-2 mb-8">
          <span className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-200">
            <LuClock size={32} className="text-white" />
          </span>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">TimeTrack</h1>
          <p className="text-sm text-slate-500">Sistema de gestión de timesheets y pagos en USDT</p>
        </header>

        <article className="w-full max-w-sm bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8">
          <header className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Crear cuenta</h2>
            <p className="text-sm text-slate-500 mt-1">Completa tus datos para registrarte</p>
          </header>
          <SignUpForm onSubmit={signUp} isPending={isPending} />
        </article>
      </section>

      <footer>
        <p className="text-xs text-slate-400 text-center mt-8">
          Pagos seguros en blockchain • Verificación automática de transacciones
        </p>
      </footer>
    </main>
  );
}
