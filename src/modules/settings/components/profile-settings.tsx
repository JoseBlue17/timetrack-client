import { useMemo } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { LuUser, LuBuilding2, LuMail, LuSave } from 'react-icons/lu';
import { useLoggedUser, useUpdateProfile } from '@/hooks';
import { EmployeePosition } from '@/enums';
import { EMAIL, REQUIRED } from '@/constants/form-rules';
import { filterOptionByLabel } from '@/helpers/filter-option-by-label';
import { UserAvatar } from '@/components/user-avatar';

const POSITION_OPTIONS = Object.values(EmployeePosition).map((value) => ({
  value,
  label: value,
}));

export function ProfileSettings() {
  const { loggedUser } = useLoggedUser();
  const { updateProfile, isUpdatingProfile } = useUpdateProfile();
  const [form] = Form.useForm();

  const initialValues = useMemo(
    () => ({
      firstName: loggedUser?.profile?.firstName ?? '',
      lastName: loggedUser?.profile?.lastName ?? '',
      position: loggedUser?.profile?.position ?? '',
      email: loggedUser?.email ?? '',
    }),
    [loggedUser],
  );

  const fullName = `${initialValues.firstName} ${initialValues.lastName}`.trim();

  const handleFinish = (values: {
    firstName: string;
    lastName: string;
    position: string;
    email: string;
  }) => {
    updateProfile(values);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Mi perfil</h2>
        <p className="text-sm text-gray-500">
          Gestiona tu información personal, tarifa por hora y firma digital
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 flex items-center gap-5 max-w-3xl">
        <UserAvatar
          size={64}
          firstName={initialValues.firstName}
          lastName={initialValues.lastName}
          avatarUrl={loggedUser?.profile?.avatarUrl}
          fallback={<LuUser size={24} />}
          className="bg-indigo-500! text-white! flex items-center justify-center text-xl font-bold"
        />
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-gray-800">{fullName || 'Usuario'}</h3>
          {initialValues.position && (
            <p className="text-sm text-gray-500 flex items-center gap-1.5">
              <LuBuilding2 size={14} />
              {initialValues.position}
            </p>
          )}
          {initialValues.email && (
            <p className="text-sm text-gray-500 flex items-center gap-1.5">
              <LuMail size={14} />
              {initialValues.email}
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

        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={handleFinish}
          className="flex flex-col gap-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="Nombre" name="firstName" rules={[REQUIRED('El nombre es requerido')]}>
              <Input
                prefix={<LuUser size={16} className="text-gray-400" />}
                placeholder="Tu nombre"
              />
            </Form.Item>

            <Form.Item
              label="Apellido"
              name="lastName"
              rules={[REQUIRED('El apellido es requerido')]}
            >
              <Input
                prefix={<LuUser size={16} className="text-gray-400" />}
                placeholder="Tu apellido"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Puesto de trabajo"
              name="position"
              rules={[REQUIRED('El puesto de trabajo es requerido')]}
            >
              <Select
                placeholder="Selecciona tu puesto"
                options={POSITION_OPTIONS}
                showSearch
                filterOption={filterOptionByLabel}
              />
            </Form.Item>

            <Form.Item
              label="Correo electrónico"
              name="email"
              rules={EMAIL('El correo es requerido')}
            >
              <Input
                prefix={<LuMail size={16} className="text-gray-400" />}
                placeholder="tu@email.com"
                type="email"
              />
            </Form.Item>
          </div>

          <div className="flex justify-end mt-2">
            <Button
              type="primary"
              htmlType="submit"
              loading={isUpdatingProfile}
              icon={<LuSave size={16} />}
              className="font-semibold"
            >
              Guardar información personal
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
