import { Layout, Menu, Button, Avatar } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  CreditCardOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import useLoggedUser from '@/hooks/use-logged-user';
import { useAuth } from '@/hooks';

const { Sider, Content } = Layout;

const NAV_ITEMS = [
  { key: '/', label: 'Dashboard', icon: <DashboardOutlined /> },
  { key: '/timesheets', label: 'Timesheets', icon: <ClockCircleOutlined /> },
  { key: '/reportes', label: 'Reportes', icon: <BarChartOutlined /> },
  { key: '/pagos', label: 'Pagos', icon: <CreditCardOutlined /> },
  { key: '/settings', label: 'Settings', icon: <SettingOutlined /> },
];

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loggedUser } = useLoggedUser();
  const { onLogout } = useAuth();

  const firstName = loggedUser?.profile?.firstName ?? '';
  const lastName = loggedUser?.profile?.lastName ?? '';
  const fullName = `${firstName} ${lastName}`.trim() || 'Usuario';
  const role = loggedUser?.role ?? '';
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();

  return (
    <Layout className="min-h-screen!">
      <Sider
        width={240}
        className="bg-indigo-950! fixed! left-0! top-0! bottom-0! h-screen! z-50! flex! flex-col!"
      >
        <div className="flex flex-col h-full">
          <div className="px-6 py-6">
            <span className="text-white text-xl font-bold tracking-wide">⏱ TimeTrack</span>
          </div>

          <div className="flex-1">
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              onClick={({ key }) => navigate(key)}
              items={NAV_ITEMS}
              className="bg-transparent! border-0!"
              theme="dark"
            />
          </div>

          <div className="px-4 py-5 border-t border-indigo-800 mt-auto">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="shrink-0 bg-indigo-500">{initials || 'U'}</Avatar>
              <div className="min-w-0">
                <p className="text-white text-sm font-semibold truncate">{fullName}</p>
                <p className="text-indigo-300 text-xs truncate capitalize">{role}</p>
              </div>
            </div>
            <Button danger block icon={<LogoutOutlined />} onClick={onLogout} size="small">
              Cerrar sesión
            </Button>
          </div>
        </div>
      </Sider>

      <Layout className="ml-60! min-h-screen!">
        <Content className="min-h-screen! bg-gray-50!">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
