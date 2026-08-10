import { useState } from 'react';
import { LuWallet, LuFolder, LuClipboardList, LuUser } from 'react-icons/lu';
import { ProjectsList } from '../components/projects-list';
import { AdminReportsSettings } from '../components/admin-reports-settings';
import { SupervisorSelection } from '../components/supervisor-selection';
import { ProfileSettings } from '../components/profile-settings';
import { WalletList } from '../components/wallets/wallet-list';
import { useIsEmployee } from '@/hooks';
import { PageHeaderActions } from '@/components/page-header-actions';

type SettingsTab = 'perfil' | 'wallets' | 'proyectos' | 'reportes';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('perfil');
  const isEmployee = useIsEmployee();

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-surface">
        <h1 className="text-2xl font-bold text-gray-800">Configuración</h1>
        <PageHeaderActions />
      </header>

      <main className="flex-1 overflow-auto p-8 bg-gray-50">
        <div className="flex gap-0 border-b border-gray-200 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab('perfil')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'perfil'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <LuUser />
            Perfil
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('wallets')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'wallets'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <LuWallet />
            Wallets
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('proyectos')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'proyectos'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <LuFolder />
            Timesheets
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reportes')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'reportes'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <LuClipboardList />
            Reportes
          </button>
        </div>

        {activeTab === 'perfil' && <ProfileSettings />}

        {activeTab === 'wallets' && <WalletList />}

        {activeTab === 'proyectos' && <ProjectsList />}
        {activeTab === 'reportes' &&
          (isEmployee ? <SupervisorSelection /> : <AdminReportsSettings />)}
      </main>
    </div>
  );
}
