import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { LuWallet, LuFolder, LuClipboardList, LuUser } from 'react-icons/lu';
import { ProjectsList } from '../components/projects-list';
import { AdminReportsSettings } from '../components/admin-reports-settings';
import { SupervisorSelection } from '../components/supervisor-selection';
import { ProfileSettings } from '../components/profile-settings';
import { WalletList } from '../components/wallets/wallet-list';
import type { TabsProps } from 'antd';
import { UserRole } from '@/enums';
import type { UserRole as UserRoleType } from '@/enums';

type SettingsTab = 'perfil' | 'wallets' | 'proyectos' | 'reportes';

interface SettingsTabConfig {
  key: SettingsTab;
  roles: UserRoleType[];
  label: ReactNode;
  children: ReactNode;
}

const ALL_SETTINGS_ITEMS: SettingsTabConfig[] = [
  {
    key: 'perfil',
    roles: [UserRole.Employee, UserRole.Supervisor, UserRole.Admin],
    label: (
      <span className="flex items-center gap-2">
        <LuUser />
        Perfil
      </span>
    ),
    children: <ProfileSettings />,
  },
  {
    key: 'wallets',
    roles: [UserRole.Employee, UserRole.Supervisor],
    label: (
      <span className="flex items-center gap-2">
        <LuWallet />
        Wallets
      </span>
    ),
    children: <WalletList />,
  },
  {
    key: 'proyectos',
    roles: [UserRole.Employee, UserRole.Supervisor],
    label: (
      <span className="flex items-center gap-2">
        <LuFolder />
        Timesheets
      </span>
    ),
    children: <ProjectsList />,
  },
  {
    key: 'reportes',
    roles: [UserRole.Employee, UserRole.Supervisor, UserRole.Admin],
    label: (
      <span className="flex items-center gap-2">
        <LuClipboardList />
        Reportes
      </span>
    ),
    children: <SupervisorSelection />,
  },
];

export function useSettingsTabItems(role?: UserRoleType): TabsProps['items'] {
  return useMemo(
    () =>
      ALL_SETTINGS_ITEMS.filter((item) => role && item.roles.includes(role)).map(
        ({ key, label, children }) => ({
          key,
          label,
          children:
            key === 'reportes' && role === UserRole.Admin ? <AdminReportsSettings /> : children,
        }),
      ),
    [role],
  );
}
