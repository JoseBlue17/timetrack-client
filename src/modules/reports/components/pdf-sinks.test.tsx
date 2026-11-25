import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ url: 'https://evil.test/report.pdf' }));
vi.mock('../hooks/use-get-report-pdf', () => ({
  useGetReportPdf: () => ({ reportPdfUrl: mocks.url, isLoading: false }),
}));
import { ReportPdfModal } from './report-pdf-modal';
import { HistoricalReportDetailRow } from '@/modules/timesheets/components/historical-report-detail-row';

describe('PDF viewer sinks', () => {
  beforeEach(() => {
    mocks.url = 'https://evil.test/report.pdf';
  });
  it('does not embed untrusted URLs from cached data', () => {
    const { container } = render(
      <HistoricalReportDetailRow reportId="report-1" monthName="enero" />,
    );
    expect(container.querySelector('iframe')).toBeNull();
    expect(screen.getByText('No se pudo cargar el PDF.')).toBeTruthy();
    render(<ReportPdfModal reportId="report-1" open onClose={vi.fn()} />);
    expect(document.querySelector('iframe')).toBeNull();
    expect(screen.getByText('Error al cargar el PDF')).toBeTruthy();
  });
  it('keeps the known bucket viewer working and opens without opener/referrer', () => {
    mocks.url = 'https://digheondev.s3.us-east-1.amazonaws.com/report.pdf?signature=test';
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    render(<ReportPdfModal reportId="report-1" open onClose={vi.fn()} />);
    expect(document.querySelector('iframe')?.src).toContain(mocks.url);
    expect(document.querySelector('iframe')?.getAttribute('referrerpolicy')).toBe('no-referrer');
    fireEvent.click(screen.getByText('Abrir en nueva pestaña'));
    expect(open).toHaveBeenCalledWith(mocks.url, '_blank', 'noopener,noreferrer');
  });
  it('does not send the parent referrer from historical report frames', () => {
    mocks.url = 'https://digheondev.s3.us-east-1.amazonaws.com/report.pdf';
    const { container } = render(
      <HistoricalReportDetailRow reportId="report-1" monthName="enero" />,
    );
    expect(container.querySelector('iframe')?.getAttribute('referrerpolicy')).toBe('no-referrer');
  });
});
