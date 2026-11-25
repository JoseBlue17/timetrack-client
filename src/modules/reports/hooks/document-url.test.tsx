import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock('@/config/http', () => ({ Http: { get: mocks.get } }));
vi.mock('@/hooks', () => ({ useInvalidateReportPdf: () => vi.fn() }));
import { useGetReportPdf } from './use-get-report-pdf';
import { useGetOldReportPdf } from './use-get-old-report-pdf';
const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(
    QueryClientProvider,
    { client: new QueryClient({ defaultOptions: { queries: { retry: false } } }) },
    children,
  );

describe('PDF response URLs', () => {
  it.each([useGetReportPdf, useGetOldReportPdf])(
    'rejects untrusted API-provided URLs',
    async (hook) => {
      mocks.get.mockResolvedValue({ data: { url: 'https://attacker.test/document.pdf' } });
      const { result } = renderHook(() => hook('report-1'), { wrapper });
      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(
        'reportPdfUrl' in result.current ? result.current.reportPdfUrl : result.current.data,
      ).toBeUndefined();
    },
  );
});
