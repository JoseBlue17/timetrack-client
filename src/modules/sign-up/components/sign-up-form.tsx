import { useState } from 'react';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import { LuEye, LuEyeOff, LuLoader } from 'react-icons/lu';
import { signUpValidationSchema } from './validations';
import { signUpInitialValues } from './initial-values';
import type { ISignUpFormProps, SignUpValues } from './sign-up.interface';

export function SignUpForm({ onSubmit, isPending }: ISignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const formik = useFormik<SignUpValues>({
    initialValues: signUpInitialValues,
    validationSchema: signUpValidationSchema,
    onSubmit,
  });

  const inputClass = (field: keyof SignUpValues) =>
    `w-full rounded-xl border px-4 py-3 text-sm text-slate-700 outline-none transition
    focus:ring-2 focus:ring-indigo-400 focus:border-transparent
    ${formik.touched[field] && formik.errors[field] ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'}`;

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4 w-full">
      <section className="flex gap-3">
        <section className="flex flex-col gap-1 flex-1">
          <label htmlFor="firstName" className="text-sm font-medium text-slate-700">
            Nombre
          </label>
          <input
            id="firstName"
            type="text"
            placeholder="Juan"
            autoComplete="given-name"
            {...formik.getFieldProps('firstName')}
            className={inputClass('firstName')}
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <span className="text-xs text-red-500">{formik.errors.firstName}</span>
          )}
        </section>

        <section className="flex flex-col gap-1 flex-1">
          <label htmlFor="lastName" className="text-sm font-medium text-slate-700">
            Apellido
          </label>
          <input
            id="lastName"
            type="text"
            placeholder="Pérez"
            autoComplete="family-name"
            {...formik.getFieldProps('lastName')}
            className={inputClass('lastName')}
          />
          {formik.touched.lastName && formik.errors.lastName && (
            <span className="text-xs text-red-500">{formik.errors.lastName}</span>
          )}
        </section>
      </section>

      {/* Email */}
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
          className={inputClass('email')}
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
            autoComplete="new-password"
            {...formik.getFieldProps('password')}
            className={`${inputClass('password')} pr-11`}
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

      {/* Confirm password */}
      <section className="flex flex-col gap-1">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
          Confirmar contraseña
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            {...formik.getFieldProps('confirmPassword')}
            className={`${inputClass('confirmPassword')} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
            tabIndex={-1}
          >
            {showConfirm ? <LuEyeOff size={18} /> : <LuEye size={18} />}
          </button>
        </div>
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <span className="text-xs text-red-500">{formik.errors.confirmPassword}</span>
        )}
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
        Crear cuenta
      </button>

      {/* Login link */}
      <p className="text-center text-sm text-slate-500 mt-1">
        ¿Ya tienes cuenta?{' '}
        <Link
          to="/sign-in"
          className="text-indigo-500 hover:text-indigo-700 font-medium transition"
        >
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
