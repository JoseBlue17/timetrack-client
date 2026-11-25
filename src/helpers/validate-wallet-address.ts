import { BlockchainNetwork } from '@/enums';
import { keccak_256 } from '@noble/hashes/sha3.js';
import { bytesToHex } from '@noble/hashes/utils.js';

const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

// Standard TRON Base58Check: https://developers.tron.network/docs/encoding
async function isTronAddress(address: string): Promise<boolean> {
  if (!/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address)) return false;
  let number = 0n;
  for (const character of address) number = number * 58n + BigInt(BASE58.indexOf(character));
  const bytes = new Uint8Array(25);
  for (let i = bytes.length - 1; i >= 0; i--) {
    bytes[i] = Number(number & 255n);
    number >>= 8n;
  }
  if (number !== 0n || bytes[0] !== 0x41) return false;
  try {
    const firstHash = await crypto.subtle.digest('SHA-256', bytes.slice(0, 21));
    const checksum = new Uint8Array(await crypto.subtle.digest('SHA-256', firstHash));
    return bytes.slice(21).every((byte, index) => byte === checksum[index]);
  } catch {
    return false;
  }
}

export async function validateWalletAddress(
  value: string | undefined,
  network: string | undefined,
): Promise<string | undefined> {
  if (network !== BlockchainNetwork.BEP20 && network !== BlockchainNetwork.TRC20) {
    return 'Red blockchain no soportada.';
  }
  const address = value?.trim() ?? '';
  if (network === BlockchainNetwork.BEP20) {
    if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
      return 'Formato inválido. BEP20: 0x seguido de 40 caracteres hexadecimales.';
    }
    const hex = address.slice(2);
    // EIP-55: unchecksummed all-lower/all-upper inputs remain supported.
    if (hex === hex.toLowerCase() || hex === hex.toUpperCase()) return undefined;
    const hash = bytesToHex(keccak_256(new TextEncoder().encode(hex.toLowerCase())));
    const expected = [...hex.toLowerCase()]
      .map((character, index) =>
        parseInt(hash[index], 16) >= 8 ? character.toUpperCase() : character,
      )
      .join('');
    return hex === expected ? undefined : 'Checksum BEP20 inválido (EIP-55).';
  }
  return (await isTronAddress(address)) ? undefined : 'Dirección TRC20 inválida (Base58Check).';
}
