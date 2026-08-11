import { useState } from 'react';
import { Modal, Radio } from 'antd';
import { LuCreditCard } from 'react-icons/lu';
import { useCreatePayment } from '@/modules/payments/hooks/use-create-payment';
import { useGetWallets } from '@/modules/settings/hooks/wallets/use-get-wallets';
import type { IMonthlyReport } from './reports.interface';

interface IReportPaymentModalProps {
  report: IMonthlyReport | null;
  onClose: () => void;
}

export function ReportPaymentModal({ report, onClose }: IReportPaymentModalProps) {
  const { mutate: createPayment, isPending: isCreatingPayment } = useCreatePayment();
  const [selectedWalletId, setSelectedWalletId] = useState<string>('');
  const { wallets: employeeWallets = [] } = useGetWallets(report?.userId);

  const handleOk = () => {
    if (report && selectedWalletId) {
      createPayment({ reportId: report.id, walletId: selectedWalletId }, { onSuccess: onClose });
    }
  };

  return (
    <Modal
      open={!!report}
      onCancel={onClose}
      onOk={handleOk}
      okText="Crear pago"
      cancelText="Cancelar"
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
            <LuCreditCard size={20} />
          </div>
          <div>
            <p className="text-base font-semibold text-gray-500">
              Selecciona la wallet del empleado
            </p>
          </div>
        </div>
      }
      width={480}
      confirmLoading={isCreatingPayment}
      okButtonProps={{ disabled: !selectedWalletId }}
    >
      <div className="flex flex-col gap-5 py-2">
        <div className="bg-stone-50/50 rounded-2xl border border-stone-100 p-5 flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-bold text-gray-700">Wallets disponibles</p>

            {employeeWallets.length === 0 ? (
              <div className="rounded-2xl border border-red-100 bg-red-50/30 p-5 text-center">
                <p className="text-red-600 text-sm font-medium">
                  Este empleado no tiene wallets registradas.
                </p>
                <p className="text-red-500 text-xs mt-1">
                  Debe agregar una en Configuración → Wallets.
                </p>
              </div>
            ) : (
              <Radio.Group
                value={selectedWalletId || undefined}
                onChange={(event) => setSelectedWalletId(event.target.value)}
                className="w-full flex flex-col gap-3"
              >
                {employeeWallets.map((wallet) => {
                  const isSelected = selectedWalletId === wallet.id;

                  return (
                    <Radio key={wallet.id} value={wallet.id} className="w-full">
                      <div
                        className={`
                          w-full rounded-xl border p-4 transition-all
                          ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-50/30 shadow-sm'
                              : 'border-stone-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/20'
                          }
                        `}
                      >
                        <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">
                          {wallet.network}
                        </p>
                        <p className="text-sm font-medium text-gray-800 break-all mt-1">
                          {wallet.walletAddress}
                        </p>
                      </div>
                    </Radio>
                  );
                })}
              </Radio.Group>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
