import { useState } from 'react';
import { BellOutlined, WalletOutlined, FolderOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { ProjectsList } from '../components/projects-list';

type SettingsTab = 'wallets' | 'proyectos';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('proyectos');

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-bold text-gray-800">Configuración</h1>
        <div className="flex items-center gap-4">
          <Input.Search placeholder="Buscar..." allowClear className="w-60" />
          <Button shape="circle" icon={<BellOutlined />} />
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8 bg-gray-50">
        <div className="flex gap-0 border-b border-gray-200 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab('wallets')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'wallets'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <WalletOutlined />
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
            <FolderOutlined />
            Proyectos
          </button>
        </div>

        {activeTab === 'wallets' && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <WalletOutlined className="text-[40px] mb-3" />
            <p className="text-base">Próximamente</p>
          </div>
        )}

        {activeTab === 'proyectos' && <ProjectsList />}
      </main>
    </div>
  );
}
