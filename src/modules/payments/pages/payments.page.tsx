import { useState } from 'react';
import { MdOutlineHistoryEdu, MdOutlinePayments } from 'react-icons/md';
import { PaymentsTable } from '../components/payments-table';
import { TablePastPayments } from '../components/table-past-payments';

type PaymentsTab = 'registros' | 'historial';

const TABS: { value: PaymentsTab; label: string; icon: React.ReactNode }[] = [
  { value: 'registros', label: 'Registros de pagos', icon: <MdOutlinePayments size={16} /> },
  { value: 'historial', label: 'Historial de pagos', icon: <MdOutlineHistoryEdu size={16} /> },
];

export function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<PaymentsTab>('registros');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pagos</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gestiona los pagos en USDT y verifica transacciones en blockchain
          </p>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8 bg-gray-50">
        <div className="flex gap-0 border-b border-gray-200 mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.value
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'registros' && <PaymentsTable />}
        {activeTab === 'historial' && <TablePastPayments />}
      </main>
    </div>
  );
}
