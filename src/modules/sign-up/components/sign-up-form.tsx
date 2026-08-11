import { Button, Form, Input } from 'antd';
import { Link } from 'react-router-dom';

import { EMAIL, PASSWORD, REQUIRED } from '@/constants/form-rules';
import { usePasswordVisibility } from '@/hooks/use-password-visibility';
import type { ISignUpFormProps, SignUpValues } from './sign-up.interface';

export function SignUpForm({ onSubmit, isPending }: ISignUpFormProps) {
  const passwordVisibility = usePasswordVisibility();
  const confirmPasswordVisibility = usePasswordVisibility();
  const [form] = Form.useForm<SignUpValues>();

  const handleFinish = (values: SignUpValues) => {
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      }}
      className="flex flex-col gap-1 w-full"
    >
      <div className="grid grid-cols-2 gap-4">
        <Form.Item
          label="Nombre"
          name="firstName"
          rules={[REQUIRED('El nombre es requerido'), { min: 2, message: 'Mínimo 2 caracteres' }]}
        >
          <Input placeholder="Juan" autoComplete="given-name" size="large" />
        </Form.Item>

        <Form.Item
          label="Apellido"
          name="lastName"
          rules={[REQUIRED('El apellido es requerido'), { min: 2, message: 'Mínimo 2 caracteres' }]}
        >
          <Input placeholder="Pérez" autoComplete="family-name" size="large" />
        </Form.Item>
      </div>

      <Form.Item label="Correo electrónico" name="email" rules={EMAIL()}>
        <Input type="email" placeholder="tu@email.com" autoComplete="email" size="large" />
      </Form.Item>

      <Form.Item label="Contraseña" name="password" rules={PASSWORD()}>
        <Input.Password
          placeholder="••••••••"
          autoComplete="new-password"
          size="large"
          iconRender={passwordVisibility.iconRender}
          visibilityToggle={{
            visible: passwordVisibility.visible,
            onVisibleChange: passwordVisibility.setVisible,
          }}
        />
      </Form.Item>

      <Form.Item
        label="Confirmar contraseña"
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Confirma tu contraseña' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Las contraseñas no coinciden'));
            },
          }),
        ]}
      >
        <Input.Password
          placeholder="••••••••"
          autoComplete="new-password"
          size="large"
          iconRender={confirmPasswordVisibility.iconRender}
          visibilityToggle={{
            visible: confirmPasswordVisibility.visible,
            onVisibleChange: confirmPasswordVisibility.setVisible,
          }}
        />
      </Form.Item>

      <Form.Item className="mb-0">
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={isPending}
          className="font-semibold"
        >
          Crear cuenta
        </Button>
      </Form.Item>

      <p className="text-center text-sm text-slate-500 mt-4">
        ¿Ya tienes cuenta?{' '}
        <Link
          to="/sign-in"
          className="text-indigo-500 hover:text-indigo-700 font-medium transition"
        >
          Inicia sesión
        </Link>
      </p>
    </Form>
  );
}
