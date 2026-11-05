import { describe, expect, it } from 'vitest';
import {
  safeDocumentUrl,
  documentEmbedUrl,
  documentCaption,
} from './documentLinks';
describe('document links and metadata', () => {
  it('allows HTTPS and local paths but rejects scripts, credentials and protocol-relative paths', () => {
    for (const url of [
      'javascript:alert(1)',
      'data:text/html,test',
      '//evil.example',
      '/\\evil.example',
      'https://user:secret@example.com',
      'http://example.com',
    ])
      expect(safeDocumentUrl(url)).toBe('');
    expect(safeDocumentUrl('/documents/jd.pdf')).toBe('/documents/jd.pdf');
    expect(safeDocumentUrl('http://127.0.0.1:1337/uploads/cover.jpg')).toBe(
      'http://127.0.0.1:1337/uploads/cover.jpg',
    );
  });
  it('uses supported preview links and leaves folders and unknown platforms as normal links', () => {
    expect(
      documentEmbedUrl(
        'https://drive.google.com/file/d/abc-123/view?usp=sharing',
      ),
    ).toBe('https://drive.google.com/file/d/abc-123/preview');
    expect(
      documentEmbedUrl('https://docs.google.com/presentation/d/e/abc/pub'),
    ).toBe(
      'https://docs.google.com/presentation/d/e/abc/embed?start=false&loop=false',
    );
    expect(documentEmbedUrl('https://drive.google.com/drive/folders/abc')).toBe(
      '',
    );
    expect(documentEmbedUrl('https://example.com/page')).toBe('');
  });
  it('formats versions and uses the effective date before the update timestamp', () => {
    expect(
      documentCaption({
        revision: '00',
        effectiveDate: '2026-09-09',
        updatedAt: '2026-11-05',
      }),
    ).toBe('v0.0 - September 09, 2026');
    expect(
      documentCaption({ revision: 'v1.2', updatedAt: '2026-10-12T23:30:00Z' }),
    ).toBe('v1.2 - October 12, 2026');
  });
});
