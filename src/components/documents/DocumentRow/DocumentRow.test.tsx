import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect, it } from 'vitest';
import { DocumentRow } from './DocumentRow';
import type { DocumentItem } from '@/types';
const document: DocumentItem = {
  id: 'jd',
  title: 'Job Description',
  category: 'membership',
  fileType: 'pdf',
  fileUrl: '/documents/jd.pdf',
  revision: '00',
  effectiveDate: '2026-09-09',
};
afterEach(cleanup);
it('shows the unified caption, gradient separator, download and internal archive page', () => {
  const { container } = render(
    <MemoryRouter>
      <DocumentRow document={document} />
    </MemoryRouter>,
  );
  expect(container.firstElementChild!.className).toContain(
    'after:bg-gradient-to-r',
  );
  expect(screen.getByText('v0.0 - September 09, 2026')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Download/ })).toHaveAttribute(
    'href',
    document.fileUrl,
  );
  expect(screen.getByRole('link', { name: /Open/ })).toHaveAttribute(
    'href',
    '/policy-documents/jd',
  );
});
it('does not create empty download links for external-only entries', () => {
  render(
    <MemoryRouter>
      <DocumentRow
        document={{ ...document, fileUrl: '', effectiveDate: undefined }}
      />
    </MemoryRouter>,
  );
  expect(screen.getByText('v0.0')).toBeInTheDocument();
  expect(
    screen.queryByRole('link', { name: /Download/ }),
  ).not.toBeInTheDocument();
});
