import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ url: 'https://evil.test/report.pdf' }));
vi.mock('../hooks/use-get-old-report-pdf', () => ({
  useGetOldReportPdf: () => ({ data: mocks.url, isLoading: false }),
}));
vi.mock('../hooks/use-old-reports-list', () => ({
  OLD_REPORTS_MONTH_NAMES: ['Enero'],
  OLD_REPORTS_YEAR_OPTIONS: [2025],
  useOldReportsList: () => ({
    oldReports: [],
    selectedMonth: 1,
    selectedYear: 2025,
    viewingPdfId: 'report-1',
  }),
}));
vi.mock('./monthly-reports-list', () => ({ MonthlyReportsList: () => null }));
import { OldReportsSection } from './old-reports-section';

describe('old PDF viewer', () => {
  it('does not embed untrusted cached document URLs and displays an error', () => {
    render(<OldReportsSection />);
    expect(document.querySelector('iframe')).toBeNull();
    expect(screen.getByText('No se pudo cargar el PDF.')).toBeTruthy();
  });
  it('does not send the parent referrer when embedding a permitted PDF', () => {
    mocks.url = 'https://digheondev.s3.us-east-1.amazonaws.com/report.pdf';
    render(<OldReportsSection />);
    expect(document.querySelector('iframe')?.getAttribute('referrerpolicy')).toBe('no-referrer');
  });
});
