import { useState } from 'react';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import { LuEye, LuEyeOff, LuLoader } from 'react-icons/lu';
import { signInValidationSchema } from '../sign-in.validations';
import { signInInitialValues } from '../sign-in.initial-values';
import type { SignInValues } from '../sign-in.interface';

interface SignInFormProps {
  onSubmit: (values: Omit<SignInValues, 'rememberMe'>) => void;
  isPending: boolean;
}

export function SignInForm({ onSubmit, isPending }: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik<SignInValues>({
    initialValues: signInInitialValues,
    validationSchema: signInValidationSchema,
    onSubmit: ({ email, password }) => onSubmit({ email, password }),
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4 w-full">
      <section className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          placeholder="tu@email.com"
          autoComplete="email"
          {...formik.getFieldProps('email')}
          className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-700 outline-none transition
            focus:ring-2 focus:ring-indigo-400 focus:border-transparent
            ${formik.touched.email && formik.errors.email ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'}`}
        />
        {formik.touched.email && formik.errors.email && (
          <span className="text-xs text-red-500">{formik.errors.email}</span>
        )}
      </section>

      {/* Password */}
      <section className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium text-slate-700">
          Contraseña
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            {...formik.getFieldProps('password')}
            className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm text-slate-700 outline-none transition
              focus:ring-2 focus:ring-indigo-400 focus:border-transparent
              ${formik.touched.password && formik.errors.password ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
            tabIndex={-1}
          >
            {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
          </button>
        </div>
        {formik.touched.password && formik.errors.password && (
          <span className="text-xs text-red-500">{formik.errors.password}</span>
        )}
      </section>

      {/* Remember me + forgot password */}
      <section className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            id="rememberMe"
            {...formik.getFieldProps('rememberMe')}
            checked={formik.values.rememberMe}
            className="w-4 h-4 rounded accent-indigo-500"
          />
          <span className="text-sm text-slate-600">Recordarme</span>
        </label>
        <button
          type="button"
          className="text-sm text-indigo-500 hover:text-indigo-700 font-medium transition"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </section>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700
          text-white font-semibold py-3 transition disabled:opacity-60 disabled:cursor-not-allowed
          flex items-center justify-center gap-2 mt-1"
      >
        {isPending && <LuLoader size={16} className="animate-spin" />}
        Iniciar sesión
      </button>

      {/* Register */}
      <p className="text-center text-sm text-slate-500 mt-1">
        ¿No tienes cuenta?{' '}
        <Link
          to="/sign-up"
          className="text-indigo-500 hover:text-indigo-700 font-medium transition"
        >
          Regístrate aquí
        </Link>
      </p>
    </form>
  );
}
