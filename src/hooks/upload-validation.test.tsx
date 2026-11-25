import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement, type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  post: vi.fn(),
  showError: vi.fn(),
  showSuccess: vi.fn(),
  generation: 1,
}));
vi.mock('@/helpers/auth-session', () => ({
  getSessionGeneration: () => mocks.generation,
  isCurrentSession: (generation: number) => generation === mocks.generation,
}));
vi.mock('@/config/http', () => ({ Http: { post: mocks.post } }));
vi.mock('@/hooks', () => ({
  useShowError: () => ({ showError: mocks.showError }),
  useShowSuccess: () => ({ showSuccess: mocks.showSuccess }),
  useInvalidateOldReports: () => vi.fn(),
}));
import { useUploadToS3 } from './use-upload-to-s3';
import { useUploadOldReport } from '@/modules/reports/hooks/use-upload-old-report';
const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(
    QueryClientProvider,
    { client: new QueryClient({ defaultOptions: { mutations: { retry: false } } }) },
    children,
  );

describe('upload hook validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.post.mockResolvedValue({ data: { signatureUrl: 'https://example.test/signature.png' } });
  });
  it('blocks invalid signature MIME and files larger than backend 5 MiB before HTTP', async () => {
    const { result } = renderHook(useUploadToS3);
    for (const file of [
      new File(['x'], 'bad.svg', { type: 'image/svg+xml' }),
      new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'large.png', { type: 'image/png' }),
      new File([], 'empty.png', { type: 'image/png' }),
    ]) {
      await act(async () => {
        expect(await result.current.uploadUserSignature(file)).toBeNull();
      });
    }
    expect(mocks.post).not.toHaveBeenCalled();
    expect(mocks.showError).toHaveBeenCalledTimes(3);
  });
  it('suppresses results and errors from a signature upload after the session changes', async () => {
    const { result } = renderHook(useUploadToS3);
    let resolve!: (response: unknown) => void;
    mocks.post.mockReturnValueOnce(
      new Promise((done) => {
        resolve = done;
      }),
    );
    let pending!: Promise<string | null>;
    act(() => {
      pending = result.current.uploadUserSignature(
        new File(['png'], 'sign.png', { type: 'image/png' }),
      );
    });
    mocks.generation++;
    await act(async () => {
      resolve({ data: { signatureUrl: 'https://example.test/signature.png' } });
      expect(await pending).toBeNull();
    });
    let reject!: (error: Error) => void;
    mocks.post.mockReturnValueOnce(
      new Promise((_, fail) => {
        reject = fail;
      }),
    );
    act(() => {
      pending = result.current.uploadUserSignature(
        new File(['png'], 'sign.png', { type: 'image/png' }),
      );
    });
    mocks.generation++;
    await act(async () => {
      reject(new Error('stale request'));
      await pending;
    });
    expect(mocks.showError).not.toHaveBeenCalled();
  });
  it('blocks nonPDF and oversized historical report files before HTTP', async () => {
    const { result } = renderHook(useUploadOldReport, { wrapper });
    for (const file of [
      new File(['x'], 'fake.pdf', { type: 'text/html' }),
      Object.assign(new File(['x'], 'large.pdf', { type: 'application/pdf' }), {}),
    ]) {
      if (file.name === 'large.pdf') Object.defineProperty(file, 'size', { value: 104857601 });
      act(() =>
        result.current.uploadOldReport({
          file,
          pdfFileName: 'report',
          referenceMonth: 1,
          referenceYear: 2025,
        }),
      );
      await waitFor(() => expect(result.current.isUploading).toBe(false));
    }
    expect(mocks.post).not.toHaveBeenCalled();
  });
});
