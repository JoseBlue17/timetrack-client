import { Button, Checkbox, Form, Input } from 'antd';
import { Link } from 'react-router-dom';

import { EMAIL, PASSWORD } from '@/constants/form-rules';
import { usePasswordVisibility } from '@/hooks/use-password-visibility';
import type { ISignInFormProps, SignInValues } from './sign-in.interface';

export function SignInForm({ onSubmit, isPending }: ISignInFormProps) {
  const [form] = Form.useForm<SignInValues>();
  const passwordVisibility = usePasswordVisibility();

  const handleFinish = ({ email, password }: SignInValues) => {
    onSubmit({ email, password });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{ email: '', password: '', rememberMe: false }}
      className="flex flex-col gap-1 w-full"
    >
      <Form.Item label="Correo electrónico" name="email" rules={EMAIL()}>
        <Input type="email" placeholder="tu@email.com" autoComplete="email" size="large" />
      </Form.Item>

      <Form.Item label="Contraseña" name="password" rules={PASSWORD()}>
        <Input.Password
          placeholder="••••••••"
          autoComplete="current-password"
          size="large"
          iconRender={passwordVisibility.iconRender}
          visibilityToggle={{
            visible: passwordVisibility.visible,
            onVisibleChange: passwordVisibility.setVisible,
          }}
        />
      </Form.Item>

      <Form.Item name="rememberMe" valuePropName="checked" className="mb-2">
        <Checkbox>Recordarme</Checkbox>
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
          Iniciar sesión
        </Button>
      </Form.Item>

      <p className="text-center text-sm text-slate-500 mt-4">
        ¿No tienes cuenta?{' '}
        <Link
          to="/sign-up"
          className="text-violet-900 hover:text-indigo-700 font-medium transition"
        >
          Regístrate aquí
        </Link>
      </p>
    </Form>
  );
}
