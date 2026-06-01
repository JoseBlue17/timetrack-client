import { useState } from 'react';
import { Button, Popconfirm, Spin, Tag } from 'antd';
import { LuWallet, LuPencil, LuTrash2, LuStar, LuPlus } from 'react-icons/lu';
import { useGetWallets } from '../../hooks/wallets/use-get-wallets';
import { useDeleteWallet } from '../../hooks/wallets/use-delete-wallet';
import { useSetDefaultWallet } from '../../hooks/wallets/use-set-default-wallet';
import { WalletFormModal } from './wallet-form-modal';
import type { IWallet } from '@/interfaces';

export function WalletList() {
  const { wallets, isLoading } = useGetWallets();
  const { mutate: deleteWallet, isPending: isDeleting } = useDeleteWallet();
  const { mutate: setDefaultWallet, isPending: isSettingDefault } = useSetDefaultWallet();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<IWallet | undefined>(undefined);

  const openEdit = (wallet: IWallet) => {
    setSelectedWallet(wallet);
    setModalOpen(true);
  };

  const openCreate = () => {
    setSelectedWallet(undefined);
    setModalOpen(true);
  };

  return (
    <>
      <div className="mb-4 bg-white p-6 rounded-2xl border border-gray-200">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-gray-800">Mis wallets crypto</h2>
            <p className="text-sm text-gray-500">
              Registra tus direcciones de wallet para recibir pagos en USDT
            </p>
          </div>

          <Button
            type="primary"
            icon={<LuPlus />}
            onClick={openCreate}
            size="large"
            className="rounded-lg! bg-indigo-500! border-indigo-500! hover:bg-indigo-600! hover:border-indigo-600! shrink-0"
          >
            Agregar wallet
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      ) : wallets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-200">
          <LuWallet className="text-[40px] mb-3" />
          <p className="text-base">No tienes wallets registradas</p>
          <p className="text-sm mt-1">Agrega una wallet para recibir pagos</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
          {wallets.map((wallet, index) => (
            <div
              key={wallet.id}
              className={index < wallets.length - 1 ? 'border-b border-gray-100' : ''}
            >
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <LuWallet className="text-indigo-500 text-[18px]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800 text-sm">{wallet.network}</p>
                    {wallet.isDefault && (
                      <Tag
                        color="indigo"
                        className="rounded-full px-2 py-0 text-xs border-none bg-indigo-50 text-indigo-600"
                      >
                        <LuStar size={10} className="inline mr-1" />
                        Por defecto
                      </Tag>
                    )}
                    <Tag
                      color={wallet.status === 'active' ? 'green' : 'default'}
                      className="rounded-full px-2 py-0 text-xs border-none"
                    >
                      {wallet.status === 'active' ? 'Activa' : 'Inactiva'}
                    </Tag>
                  </div>
                  <p className="text-gray-400 text-xs truncate font-mono mt-0.5">
                    {wallet.walletAddress}
                  </p>
                  {wallet.label && <p className="text-gray-400 text-xs">{wallet.label}</p>}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!wallet.isDefault && wallet.status === 'active' && (
                    <Button
                      type="text"
                      icon={<LuStar className="text-gray-400 hover:text-indigo-500" />}
                      loading={isSettingDefault}
                      onClick={() => setDefaultWallet({ walletId: wallet.id })}
                      title="Establecer como predeterminada"
                    />
                  )}

                  <Button
                    type="text"
                    icon={<LuPencil className="text-gray-400" />}
                    onClick={() => openEdit(wallet)}
                  />

                  <Popconfirm
                    title="¿Eliminar esta wallet?"
                    description="Ya no podrás recibir pagos en esta dirección."
                    onConfirm={() => deleteWallet({ walletId: wallet.id })}
                    okText="Sí"
                    cancelText="No"
                  >
                    <Button
                      type="text"
                      icon={<LuTrash2 className="text-gray-400 hover:text-red-500" />}
                      loading={isDeleting}
                    />
                  </Popconfirm>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <WalletFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        wallet={selectedWallet}
      />
    </>
  );
}
