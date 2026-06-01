import * as Yup from 'yup';
import type { IWalletFormValues } from './wallets.interface';
import { BlockchainNetwork } from '@/enums';

const validateWalletFormat = (value: string | undefined, network: string | undefined) => {
  if (!value || !network) return true;
  const address = value.trim();

  if (network === BlockchainNetwork.BEP20) {
    return address.startsWith('0x') && address.length === 42;
  }
  if (network === BlockchainNetwork.TRC20) {
    return address.startsWith('T') && address.length === 34;
  }
  return false;
};

export const walletValidationSchema = Yup.object<IWalletFormValues>({
  network: Yup.string().required('La red es obligatoria'),
  walletAddress: Yup.string()
    .required('La dirección de wallet es obligatoria')
    .test(
      'wallet-format',
      'Formato inválido. BEP20: 0x + 42 caracteres. TRC20: T + 34 caracteres.',
      function (value) {
        return validateWalletFormat(value, this.parent.network);
      },
    ),
  label: Yup.string().optional(),
  isDefault: Yup.boolean().optional(),
});
