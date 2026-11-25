import { describe, expect, it, vi } from 'vitest';
import { openExternal } from './open-external';
import { openBinanceWithdrawal } from './binance-withdrawal';

describe('external navigation', () => {
  it('opens HTTPS pages without an opener or referrer', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    openBinanceWithdrawal();
    expect(open).toHaveBeenCalledWith(
      'https://www.binance.com/es-LA/my/wallet/account/withdrawal',
      '_blank',
      'noopener,noreferrer',
    );
    open.mockClear();
    openExternal('javascript:alert(1)');
    expect(open).not.toHaveBeenCalled();
  });
});
