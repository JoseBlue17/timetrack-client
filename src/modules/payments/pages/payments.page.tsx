import { PaymentsTable } from '../components/payments-table';

export function PaymentsPage() {
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

      <main className="max-w-5xl mx-auto px-6 py-6">
        <PaymentsTable />
      </main>
    </div>
  );
}
