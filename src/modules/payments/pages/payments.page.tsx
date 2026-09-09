import { useState } from 'react';
import { Tabs } from 'antd';
import { PageHeader } from '@/components/page-header';
import { useScrollHandlers } from '@/contexts/scroll-handlers-context';
import { usePaymentsTabItems } from '../hooks/use-payments-tab-items';

type PaymentsTab = 'registros' | 'historial';

export function PaymentsPage() {
  const { handleScroll } = useScrollHandlers();
  const [activeTab, setActiveTab] = useState<PaymentsTab>('registros');
  const items = usePaymentsTabItems();

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <PageHeader
        title="Pagos"
        subtitle="Gestiona los pagos en USDT y verifica transacciones en blockchain"
      />

      <main className="flex-1 overflow-auto p-8 bg-gray-50" onScroll={handleScroll}>
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as PaymentsTab)}
          items={items}
          className="mb-8"
        />
      </main>
    </div>
  );
}
