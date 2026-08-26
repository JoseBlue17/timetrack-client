import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '@/hooks';
import useLoggedUser from '@/hooks/use-logged-user';
import { cn } from '@/tools/cn';
import { AppLayoutSidebarFooter } from './app-layout-sidebar-footer';
import { useNavItems } from './use-nav-items';

const { Sider, Content } = Layout;

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loggedUser } = useLoggedUser();
  const { onLogout } = useAuth();

  const navItems = useNavItems();

  const firstName = loggedUser?.profile?.firstName ?? '';
  const lastName = loggedUser?.profile?.lastName ?? '';
  const fullName = `${firstName} ${lastName}`.trim() || 'Usuario';
  const role = loggedUser?.role ?? '';

  return (
    <Layout className="min-h-screen">
      <Sider
        width={240}
        className={cn('bg-slate-50 fixed left-0 top-0 bottom-0 h-screen z-50 flex flex-col')}
      >
        <div className="flex flex-col h-full">
          <div className="px-6 py-6">
            <span className="text-black text-xl font-bold tracking-wide">ClockLedger</span>
          </div>

          <div className="flex-1">
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              onClick={({ key }) => navigate(key)}
              items={navItems as unknown as MenuProps['items']}
              className={cn('bg-transparent border-0')}
              theme="light"
            />
          </div>

          <AppLayoutSidebarFooter
            firstName={firstName}
            lastName={lastName}
            fullName={fullName}
            role={role}
            avatarUrl={loggedUser?.profile?.avatarUrl}
            onLogout={onLogout}
          />
        </div>
      </Sider>

      <Layout className={cn('ml-60 min-h-screen')}>
        <Content className={cn('min-h-screen bg-gray-50')}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
