import { describe, expect, it } from 'vitest';
import { validateWalletAddress } from './validate-wallet-address';

describe('wallet address validation', () => {
  it('rejects nonhex BEP20 and unsupported networks', async () => {
    expect(await validateWalletAddress(`0x${'z'.repeat(40)}`, 'BEP20')).toBeTruthy();
    expect(await validateWalletAddress(`0x${'a'.repeat(40)}`, 'other')).toBeTruthy();
    expect(
      await validateWalletAddress(' 0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359 ', 'BEP20'),
    ).toBeUndefined();
  });
  it('rejects a mixed-case Ethereum address with an incorrect EIP55 checksum', async () => {
    expect(
      await validateWalletAddress('0xfb6916095ca1df60bB79Ce92cE3Ea74c37c5d359', 'BEP20'),
    ).toBeTruthy();
    expect(
      await validateWalletAddress('0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359', 'BEP20'),
    ).toBeUndefined();
    expect(await validateWalletAddress(`0x${'a'.repeat(40)}`, 'BEP20')).toBeUndefined();
  });
  it('checks TRON Base58Check, not only prefix and length', async () => {
    expect(
      await validateWalletAddress('TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL', 'TRC20'),
    ).toBeUndefined();
    expect(await validateWalletAddress('TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeM', 'TRC20')).toBeTruthy();
    expect(await validateWalletAddress('T000000000000000000000000000000000', 'TRC20')).toBeTruthy();
  });
});
