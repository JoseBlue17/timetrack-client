import { useMemo } from 'react';
import { LuWallet, LuFolder, LuClipboardList, LuUser } from 'react-icons/lu';
import { ProjectsList } from '../components/projects-list';
import { AdminReportsSettings } from '../components/admin-reports-settings';
import { SupervisorSelection } from '../components/supervisor-selection';
import { ProfileSettings } from '../components/profile-settings';
import { WalletList } from '../components/wallets/wallet-list';
import type { TabsProps } from 'antd';

export function useSettingsTabItems(isEmployee: boolean): TabsProps['items'] {
  return useMemo(
    () => [
      {
        key: 'perfil',
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
        label: (
          <span className="flex items-center gap-2">
            <LuClipboardList />
            Reportes
          </span>
        ),
        children: isEmployee ? <SupervisorSelection /> : <AdminReportsSettings />,
      },
    ],
    [isEmployee],
  );
}
