import { useMemo } from 'react';
import { Modal, Button, Select } from 'antd';
import { useFormik } from 'formik';
import { walletValidationSchema } from './wallets.validations';
import type { IWalletFormModalProps, IWalletFormValues } from './wallets.interface';
import { useAddWallet } from '../../hooks/wallets/use-add-wallet';
import { useUpdateWallet } from '../../hooks/wallets/use-update-wallet';
import { BlockchainNetwork } from '@/enums';

const NETWORK_OPTIONS = [
  { value: BlockchainNetwork.BEP20, label: 'BEP20 (Binance Smart Chain)' },
  { value: BlockchainNetwork.TRC20, label: 'TRC20 (Tron)' },
];

const INITIAL_VALUES: IWalletFormValues = {
  network: BlockchainNetwork.BEP20,
  walletAddress: '',
  label: '',
  isDefault: false,
};

export function WalletFormModal({ open, onClose, wallet }: IWalletFormModalProps) {
  const { mutate: addWallet, isPending: isAdding } = useAddWallet();
  const { mutate: updateWallet, isPending: isUpdating } = useUpdateWallet();

  const isEditing = !!wallet;
  const isPending = isAdding || isUpdating;

  const initialValues = useMemo<IWalletFormValues>(() => {
    if (!wallet) return INITIAL_VALUES;
    return {
      network: wallet.network,
      walletAddress: wallet.walletAddress,
      label: wallet.label ?? '',
      isDefault: wallet.isDefault,
    };
  }, [wallet]);

  const formik = useFormik<IWalletFormValues>({
    initialValues,
    enableReinitialize: true,
    validationSchema: walletValidationSchema,
    onSubmit: (values) => {
      if (isEditing && wallet) {
        updateWallet(
          {
            walletId: wallet.id,
            values: {
              walletAddress: values.walletAddress,
              label: values.label,
            },
          },
          { onSuccess: onClose },
        );
      } else {
        addWallet(values, { onSuccess: onClose });
      }
    },
  });

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={480}
      title={
        <span className="text-lg font-bold text-gray-800">
          {isEditing ? 'Editar wallet' : 'Agregar wallet'}
        </span>
      }
    >
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Red blockchainm</label>
          <Select
            className="w-full"
            options={NETWORK_OPTIONS}
            value={formik.values.network}
            onChange={(value) => formik.setFieldValue('network', value)}
            disabled={isEditing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dirección de wallet
          </label>
          <input
            type="text"
            name="walletAddress"
            value={formik.values.walletAddress}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="0x... o T..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {formik.touched.walletAddress && formik.errors.walletAddress && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.walletAddress}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Etiqueta (opcional)
          </label>
          <input
            type="text"
            name="label"
            value={formik.values.label}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Ej: Wallet principal"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {!isEditing && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formik.values.isDefault}
              onChange={formik.handleChange}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="isDefault" className="text-sm text-gray-700">
              Establecer como wallet por defecto
            </label>
          </div>
        )}

        <div className="flex gap-3 mt-2">
          <Button
            type="default"
            block
            onClick={onClose}
            className="rounded-lg! border-gray-300! text-gray-700!"
          >
            Cancelar
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isPending}
            className="rounded-lg! bg-indigo-500! border-indigo-500! hover:bg-indigo-600! hover:border-indigo-600!"
          >
            {isEditing ? 'Guardar cambios' : 'Agregar wallet'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
