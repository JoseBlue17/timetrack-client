import { renderHook } from '@testing-library/react';
import { AxiosError, CanceledError } from 'axios';
import { describe, expect, it, vi } from 'vitest';

import { useShowError } from './use-show-error';

const { triggerToast } = vi.hoisted(() => ({ triggerToast: vi.fn() }));
vi.mock('./use-toast', () => ({ useToast: () => ({ triggerToast }) }));

describe('useShowError', () => {
  it('does not show failures for operations canceled by a session transition', () => {
    const { result } = renderHook(() => useShowError());
    result.current.showError(new CanceledError('Session changed'));
    expect(triggerToast).not.toHaveBeenCalled();
  });

  it('keeps displaying ordinary request failures', () => {
    const { result } = renderHook(() => useShowError());
    result.current.showError(new AxiosError('Request failed'));
    expect(triggerToast).toHaveBeenCalledWith({ title: 'Request failed', type: 'error' });
  });
});
