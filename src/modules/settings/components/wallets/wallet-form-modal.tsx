import { Modal, Form, Button, Select, Input, Checkbox } from 'antd';
import type { IWalletFormModalProps, IWalletFormValues } from './wallets.interface';
import { useAddWallet } from '../../hooks/wallets/use-add-wallet';
import { useUpdateWallet } from '../../hooks/wallets/use-update-wallet';
import { BlockchainNetwork } from '@/enums';
import { validateWalletAddress } from '@/helpers/validate-wallet-address';
import { REQUIRED } from '@/constants/form-rules';

const NETWORK_OPTIONS = [
  { value: BlockchainNetwork.BEP20, label: 'BEP20 (Binance Smart Chain)' },
  { value: BlockchainNetwork.TRC20, label: 'TRC20 (Tron)' },
];

const walletAddressValidator = (_: unknown, value: string, network?: string) => {
  const error = validateWalletAddress(value, network);
  return error ? Promise.reject(new Error(error)) : Promise.resolve();
};

export function WalletFormModal({ open, onClose, wallet }: IWalletFormModalProps) {
  const { mutate: addWallet, isPending: isAdding } = useAddWallet();
  const { mutate: updateWallet, isPending: isUpdating } = useUpdateWallet();

  const isEditing = !!wallet;
  const isPending = isAdding || isUpdating;
  const [form] = Form.useForm<IWalletFormValues>();

  const network = Form.useWatch('network', form);

  const initialValues: IWalletFormValues = {
    network: wallet?.network ?? BlockchainNetwork.BEP20,
    walletAddress: wallet?.walletAddress ?? '',
    label: wallet?.label ?? '',
    isDefault: wallet?.isDefault ?? false,
  };

  const handleSubmit = (values: IWalletFormValues) => {
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
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      width={480}
      title={
        <span className="text-lg font-bold text-gray-800">
          {isEditing ? 'Editar wallet' : 'Agregar wallet'}
        </span>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
        className="flex flex-col gap-2 mt-4"
      >
        <Form.Item
          label="Red blockchain"
          name="network"
          rules={[REQUIRED('La red es obligatoria')]}
        >
          <Select options={NETWORK_OPTIONS} disabled={isEditing} />
        </Form.Item>

        <Form.Item
          label="Dirección de wallet"
          name="walletAddress"
          rules={[
            REQUIRED('La dirección de wallet es obligatoria'),
            { validator: (_, value) => walletAddressValidator(_, value, network) },
          ]}
        >
          <Input placeholder="0x... o T..." />
        </Form.Item>

        <Form.Item
          label="Etiqueta (opcional)"
          name="label"
          rules={[{ max: 100, message: 'Máximo 100 caracteres' }]}
        >
          <Input placeholder="Ej: Wallet principal" />
        </Form.Item>

        {!isEditing && (
          <Form.Item name="isDefault" valuePropName="checked" className="mb-0">
            <Checkbox>Establecer como wallet por defecto</Checkbox>
          </Form.Item>
        )}

        <div className="flex gap-3 mt-2">
          <Button type="default" block onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isPending}
            className="font-semibold"
          >
            {isEditing ? 'Guardar cambios' : 'Agregar wallet'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
