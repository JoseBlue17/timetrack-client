import type { IWallet } from '@/interfaces';

export interface IWalletFormModalProps {
  open: boolean;
  onClose: () => void;
  wallet?: IWallet;
}

export interface IWalletFormValues {
  network: string;
  walletAddress: string;
  label?: string;
  isDefault: boolean;
}
