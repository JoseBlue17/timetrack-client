import { describe, expect, it } from 'vitest';
import { getDocumentUrl } from './document-url';

describe('document URL policy', () => {
  it('allows the known bucket and configured exact HTTPS origins only', () => {
    expect(
      getDocumentUrl('https://digheondev.s3.us-east-1.amazonaws.com/report.pdf?signature=abc'),
    ).toContain('?signature=abc');
    expect(
      getDocumentUrl('https://api.example.test/reports/1/pdf', ['https://api.example.test']),
    ).toBeTruthy();
    for (const url of [
      'javascript:alert(1)',
      'data:text/html,evil',
      '//evil.test/x',
      'http://api.example.test/x',
      'https://api.example.test.evil.test/x',
      'https://user:pass@api.example.test/x',
      'https://api.example.test:444/x',
    ]) {
      expect(getDocumentUrl(url, ['https://api.example.test'])).toBeUndefined();
    }
  });
});
