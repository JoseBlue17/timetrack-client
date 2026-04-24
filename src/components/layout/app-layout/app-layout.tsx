import { Layout, Menu, Button, Avatar } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LuHouse,
  LuClock,
  LuClipboardList,
  LuCreditCard,
  LuSettings,
  LuLogOut,
} from 'react-icons/lu';
import useLoggedUser from '@/hooks/use-logged-user';
import { useAuth } from '@/hooks';

const { Sider, Content } = Layout;
const colorText = 'text-black! text-lg';
const labelText = 'text-black!';

const NAV_ITEMS = [
  {
    key: '/',
    label: <span className={labelText}>Dashboard</span>,
    icon: <LuHouse className={colorText} />,
  },
  {
    key: '/timesheets',
    label: <span className={labelText}>Timesheets</span>,
    icon: <LuClock className={colorText} />,
  },
  {
    key: '/reportes',
    label: <span className={labelText}>Reportes</span>,
    icon: <LuClipboardList className={colorText} />,
  },
  {
    key: '/pagos',
    label: <span className={labelText}>Pagos</span>,
    icon: <LuCreditCard className={colorText} />,
  },
  {
    key: '/settings',
    label: <span className={labelText}>Settings</span>,
    icon: <LuSettings className={colorText} />,
  },
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
        className="bg-gray-50! fixed! left-0! top-0! bottom-0! h-screen! z-50! flex! flex-col!"
      >
        <div className="flex flex-col h-full">
          <div className="px-6 py-6">
            <span className="text-black text-xl font-bold tracking-wide">
              <LuClock className="inline-block mr-2" /> TimeTrack
            </span>
          </div>

          <div className="flex-1">
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              onClick={({ key }) => navigate(key)}
              items={NAV_ITEMS}
              className="bg-transparent! border-0!"
              theme="light"
            />
          </div>

          <div className="px-4 py-5 border-t border-gray-200 mt-auto">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="shrink-0 bg-indigo-100! text-indigo-600!">
                {initials || 'U'}
              </Avatar>
              <div className="min-w-0">
                <p className="text-black text-sm font-semibold truncate">{fullName}</p>
                <p className="text-gray-500 text-xs truncate capitalize">{role}</p>
              </div>
            </div>
            <Button
              icon={<LuLogOut />}
              onClick={onLogout}
              className="w-full bg-gray-50! hover:bg-red-50! hover:border-red-200! hover:text-red-600!"
            >
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
