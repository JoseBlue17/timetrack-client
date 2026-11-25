import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({
  updateProfile: vi.fn(),
  updateProfileAsync: vi.fn(),
  updateLoggedUser: vi.fn(),
  upload: vi.fn(),
  invalidate: vi.fn(),
  showSuccess: vi.fn(),
  generation: 1,
  loggedUser: {
    id: 'user-1',
    profile: { firstName: 'Test', lastName: 'User', signatureImageUrl: 'old' },
  },
}));
vi.mock('./use-logged-user', () => ({
  default: () => ({ loggedUser: mocks.loggedUser, updateLoggedUser: mocks.updateLoggedUser }),
}));
vi.mock('./use-upload-to-s3', () => ({
  useUploadToS3: () => ({ uploadUserSignature: mocks.upload, isUploading: false }),
}));
vi.mock('./use-update-profile', () => ({
  useUpdateProfile: () => ({
    updateProfile: mocks.updateProfile,
    updateProfileAsync: mocks.updateProfileAsync,
    isUpdatingProfile: false,
  }),
}));
vi.mock('./use-show-success', () => ({
  useShowSuccess: () => ({ showSuccess: mocks.showSuccess }),
}));
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: mocks.invalidate }),
}));
vi.mock('@/modules/settings/hooks/signature/use-signature-display-url', () => ({
  useSignatureDisplayUrl: (url: string) => url,
}));
vi.mock('@/helpers/auth-session', () => ({
  getSessionGeneration: () => mocks.generation,
  isCurrentSession: (generation: number) => generation === mocks.generation,
}));
vi.mock('@/hooks', async () => ({
  useSignature: (await import('./use-signature')).useSignature,
}));
import { useSignatureDraft } from '@/modules/settings/hooks/signature/use-signature-draft';
import { useSignature } from './use-signature';
import { useAdminSignature } from './use-admin-signature';

describe('signature draft persistence through the real signature hook', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.generation = 1;
    localStorage.clear();
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: vi.fn(() => 'blob:preview'),
    });
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: vi.fn() });
  });

  it('keeps deletion pending until API confirmation', async () => {
    let resolve!: (value: { user: typeof mocks.loggedUser }) => void;
    mocks.updateProfileAsync.mockImplementation(
      async () =>
        await new Promise<{ user: typeof mocks.loggedUser }>((done) => {
          resolve = done;
        }),
    );
    const { result } = renderHook(useSignatureDraft);
    act(() => result.current.onChange(null));
    let pending!: Promise<void>;
    await act(async () => {
      pending = result.current.onSave();
    });
    expect(result.current.hasChanges).toBe(true);
    expect(result.current.signatureUrl).toBeNull();
    await act(async () => {
      resolve({ user: mocks.loggedUser });
      await pending;
    });
    expect(result.current.hasChanges).toBe(false);
  });

  it('preserves deletion intent when the API rejects', async () => {
    mocks.updateProfileAsync.mockRejectedValue(new Error('API rejected deletion'));
    const { result } = renderHook(useSignatureDraft);
    act(() => result.current.onChange(null));
    await act(async () => {
      await result.current.onSave();
    });
    expect(result.current.hasChanges).toBe(true);
    expect(result.current.signatureUrl).toBeNull();
  });

  it.each(['reject', 'empty', 'stale', 'success'])(
    'handles %s upload without losing unconfirmed draft',
    async (outcome) => {
      let resolve!: (url: string | undefined) => void;
      let reject!: (error: Error) => void;
      mocks.upload.mockImplementation(
        async () =>
          await new Promise<string | undefined>((done, fail) => {
            resolve = done;
            reject = fail;
          }),
      );
      const { result } = renderHook(useSignatureDraft);
      act(() => result.current.onChange(new File(['png'], 'sign.png', { type: 'image/png' })));
      let pending!: Promise<void>;
      await act(async () => {
        pending = result.current.onSave();
      });
      expect(result.current.hasChanges).toBe(true);
      expect(result.current.signatureUrl).toBe('blob:preview');
      if (outcome === 'stale') mocks.generation++;
      await act(async () => {
        if (outcome === 'reject') reject(new Error('Upload rejected'));
        else resolve(outcome === 'empty' ? undefined : 'https://bucket.test/sign.png');
        await pending;
      });
      expect(result.current.hasChanges).toBe(outcome !== 'success');
      if (outcome === 'success') {
        expect(mocks.updateLoggedUser).toHaveBeenCalledWith(
          expect.objectContaining({
            profile: expect.objectContaining({ signatureImageUrl: 'https://bucket.test/sign.png' }),
          }),
        );
        expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:preview');
      } else {
        expect(result.current.signatureUrl).toBe('blob:preview');
        expect(URL.revokeObjectURL).not.toHaveBeenCalled();
        expect(mocks.updateLoggedUser).not.toHaveBeenCalled();
        expect(mocks.invalidate).not.toHaveBeenCalled();
      }
    },
  );
});

for (const admin of [false, true]) {
  describe(admin ? 'admin signature persistence' : 'signature persistence', () => {
    beforeEach(() => {
      vi.resetAllMocks();
      mocks.generation = 1;
      localStorage.clear();
    });
    const useSubject = () => {
      const regular = useSignature();
      const supervisor = useAdminSignature();
      return admin ? supervisor.setAdminSignatureDataUrl : regular.setSignature;
    };
    it('persists deletion as null before local cleanup without duplicate notices', async () => {
      const key = admin ? 'timetrack_admin_signature' : 'timetrack_signature';
      localStorage.setItem(key, 'legacy');
      const { result } = renderHook(useSubject);
      let resolve!: (value: { user: typeof mocks.loggedUser }) => void;
      mocks.updateProfileAsync.mockImplementation(
        async () =>
          await new Promise<{ user: typeof mocks.loggedUser }>((done) => {
            resolve = done;
          }),
      );
      let settled = false;
      let pending!: Promise<unknown>;
      await act(async () => {
        pending = result.current(null).then((success) => {
          settled = true;
          return success;
        });
        await Promise.resolve();
      });
      expect(settled).toBe(false);
      expect(mocks.updateProfileAsync).toHaveBeenCalledWith(
        expect.objectContaining({ signatureImageUrl: null }),
      );
      expect(mocks.updateLoggedUser).not.toHaveBeenCalled();
      expect(localStorage.getItem(key)).toBe('legacy');
      expect(mocks.showSuccess).not.toHaveBeenCalled();
      await act(async () => {
        resolve({ user: mocks.loggedUser });
        expect(await pending).toBe(true);
      });
      expect(localStorage.getItem(key)).toBeNull();
      expect(mocks.showSuccess).not.toHaveBeenCalled();
    });
    it('does not clean legacy storage when deletion completes in a different session', async () => {
      const key = admin ? 'timetrack_admin_signature' : 'timetrack_signature';
      localStorage.setItem(key, 'legacy');
      let resolve!: (value: { user: typeof mocks.loggedUser }) => void;
      mocks.updateProfileAsync.mockImplementation(
        async () =>
          await new Promise<{ user: typeof mocks.loggedUser }>((done) => {
            resolve = done;
          }),
      );
      const { result } = renderHook(useSubject);
      let pending!: Promise<boolean>;
      act(() => {
        pending = result.current(null);
      });
      mocks.generation++;
      await act(async () => {
        resolve({ user: mocks.loggedUser });
        expect(await pending).toBe(false);
      });
      expect(localStorage.getItem(key)).toBe('legacy');
      expect(mocks.updateLoggedUser).not.toHaveBeenCalled();
    });
    it('returns false on rejected deletion without local cleanup', async () => {
      const key = admin ? 'timetrack_admin_signature' : 'timetrack_signature';
      localStorage.setItem(key, 'legacy');
      mocks.updateProfileAsync.mockRejectedValue(new Error('API rejected deletion'));
      const { result } = renderHook(useSubject);
      await act(async () => {
        expect(await result.current(null)).toBe(false);
      });
      expect(localStorage.getItem(key)).toBe('legacy');
      expect(mocks.updateLoggedUser).not.toHaveBeenCalled();
    });
    it('confirms a successful upload and updates the current user', async () => {
      mocks.upload.mockResolvedValue('https://bucket.test/sign.png');
      const { result } = renderHook(useSubject);
      await act(async () => {
        expect(await result.current(new File(['png'], 'sign.png'))).toBe(true);
      });
      expect(mocks.updateLoggedUser).toHaveBeenCalledOnce();
      expect(mocks.invalidate).toHaveBeenCalledOnce();
    });
    it('returns false on rejected upload instead of rejecting an event handler', async () => {
      mocks.upload.mockRejectedValue(new Error('Upload rejected'));
      const { result } = renderHook(useSubject);
      await act(async () => {
        expect(await result.current(new File(['png'], 'sign.png'))).toBe(false);
      });
      expect(mocks.updateLoggedUser).not.toHaveBeenCalled();
      expect(mocks.invalidate).not.toHaveBeenCalled();
    });
    it('does not apply an upload completing after a session change', async () => {
      let resolve!: (url: string) => void;
      mocks.upload.mockReturnValue(
        new Promise<string>((done) => {
          resolve = done;
        }),
      );
      const { result } = renderHook(useSubject);
      let pending: Promise<unknown>;
      act(() => {
        pending = result.current(new File(['png'], 'sign.png', { type: 'image/png' }));
      });
      mocks.generation++;
      await act(async () => {
        resolve('https://bucket.test/sign.png');
        await pending;
      });
      expect(mocks.updateLoggedUser).not.toHaveBeenCalled();
      expect(mocks.invalidate).not.toHaveBeenCalled();
      expect(mocks.showSuccess).not.toHaveBeenCalled();
    });
  });
}
