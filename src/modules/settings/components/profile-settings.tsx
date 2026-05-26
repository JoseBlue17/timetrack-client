import { useMemo } from 'react';
import { Button, Input, Select } from 'antd';
import { LuUser, LuBuilding2, LuMail, LuSave } from 'react-icons/lu';
import { useFormik } from 'formik';
import { useLoggedUser, useUpdateProfile } from '@/hooks';
import { EmployeePosition } from '@/enums';
import { profileSettingsSchema } from './profile-settings.validation';

const POSITION_OPTIONS = Object.values(EmployeePosition).map((value) => ({
  value,
  label: value,
}));

function getInitials(firstName?: string, lastName?: string) {
  const first = firstName?.charAt(0).toUpperCase() ?? '';
  const last = lastName?.charAt(0).toUpperCase() ?? '';
  return `${first}${last}`;
}

export function ProfileSettings() {
  const { loggedUser } = useLoggedUser();
  const { updateProfile, isUpdatingProfile } = useUpdateProfile();

  const initialValues = useMemo(
    () => ({
      firstName: loggedUser?.profile?.firstName ?? '',
      lastName: loggedUser?.profile?.lastName ?? '',
      position: loggedUser?.profile?.position ?? '',
      email: loggedUser?.email ?? '',
    }),
    [loggedUser],
  );

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: profileSettingsSchema,
    onSubmit: (values) => {
      updateProfile(values);
    },
  });

  const showErrors = formik.submitCount > 0;

  const fullName = `${formik.values.firstName} ${formik.values.lastName}`.trim();
  const initials = getInitials(formik.values.firstName, formik.values.lastName);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Mi perfil</h2>
        <p className="text-sm text-gray-500">
          Gestiona tu información personal, tarifa por hora y firma digital
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 flex items-center gap-5 max-w-3xl">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center text-white text-xl font-bold shrink-0">
          {initials || <LuUser size={24} />}
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-gray-800">{fullName || 'Usuario'}</h3>
          {formik.values.position && (
            <p className="text-sm text-gray-500 flex items-center gap-1.5">
              <LuBuilding2 size={14} />
              {formik.values.position}
            </p>
          )}
          {formik.values.email && (
            <p className="text-sm text-gray-500 flex items-center gap-1.5">
              <LuMail size={14} />
              {formik.values.email}
            </p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
            <LuUser size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-800">Información personal</h3>
            <p className="text-sm text-gray-500">Actualiza tus datos de contacto y puesto</p>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="text-red-500 mr-1">*</span>Nombre
              </label>
              <Input
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                prefix={<LuUser size={16} className="text-gray-400" />}
                placeholder="Tu nombre"
                status={showErrors && formik.errors.firstName ? 'error' : ''}
                className="rounded-lg"
              />
              {showErrors && formik.errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="text-red-500 mr-1">*</span>Apellido
              </label>
              <Input
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                prefix={<LuUser size={16} className="text-gray-400" />}
                placeholder="Tu apellido"
                status={showErrors && formik.errors.lastName ? 'error' : ''}
                className="rounded-lg"
              />
              {showErrors && formik.errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="text-red-500 mr-1">*</span>Puesto de trabajo
              </label>
              <Select
                value={formik.values.position || undefined}
                onChange={(value) => formik.setFieldValue('position', value)}
                onBlur={() => formik.setFieldTouched('position', true)}
                placeholder="Selecciona tu puesto"
                options={POSITION_OPTIONS}
                status={showErrors && formik.errors.position ? 'error' : ''}
                className="w-full"
                showSearch
                filterOption={(input, option) =>
                  String(option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
              {showErrors && formik.errors.position && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.position}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="text-red-500 mr-1">*</span>Correo electrónico
              </label>
              <Input
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                prefix={<LuMail size={16} className="text-gray-400" />}
                placeholder="tu@email.com"
                status={showErrors && formik.errors.email ? 'error' : ''}
                className="rounded-lg"
              />
              {showErrors && formik.errors.email && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-2">
            <Button
              type="primary"
              htmlType="submit"
              loading={isUpdatingProfile}
              icon={<LuSave size={16} />}
              className="rounded-xl font-semibold bg-indigo-500! border-indigo-500! hover:bg-indigo-600! hover:border-indigo-600!"
            >
              Guardar información personal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
