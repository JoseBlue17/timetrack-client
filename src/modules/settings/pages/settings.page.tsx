import { useState } from 'react';
import { Tabs } from 'antd';
import { useCurrentRole } from '@/hooks';
import { PageHeader } from '@/components/page-header';
import { useSettingsTabItems } from '../hooks/use-settings-tab-items';

type SettingsTab = 'perfil' | 'wallets' | 'proyectos' | 'reportes';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('perfil');
  const role = useCurrentRole();
  const items = useSettingsTabItems(role);

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Configuración" />

      <main className="flex-1 overflow-auto p-8 bg-gray-50">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as SettingsTab)}
          items={items}
          className="mb-8"
        />
      </main>
    </div>
  );
}
