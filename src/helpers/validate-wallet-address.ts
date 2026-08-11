import { BlockchainNetwork } from '@/enums';

export function validateWalletAddress(
  value: string | undefined,
  network: string | undefined,
): string | undefined {
  if (!value || !network) return undefined;

  const address = value.trim();

  if (network === BlockchainNetwork.BEP20) {
    return address.startsWith('0x') && address.length === 42
      ? undefined
      : 'Formato inválido. BEP20: 0x + 42 caracteres.';
  }

  if (network === BlockchainNetwork.TRC20) {
    return address.startsWith('T') && address.length === 34
      ? undefined
      : 'Formato inválido. TRC20: T + 34 caracteres.';
  }

  return undefined;
}
