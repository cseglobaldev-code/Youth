import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect, it, vi } from 'vitest';
import { DocumentDetailPage } from './DocumentDetailPage';
const fetchDocument = vi.hoisted(() => vi.fn());
vi.mock('@/api/documents', () => ({ fetchDocument }));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
const base = {
  id: 'd1',
  title: 'Terms of Service',
  category: 'legal',
  fileType: 'pdf',
  fileUrl: '',
  updatedAt: '2026-10-12T14:00:00Z',
  content: [
    {
      type: 'paragraph',
      children: [{ type: 'text', text: 'Legal content from CMS' }],
    },
  ],
};
it('renders CMS content and Last Updated from the published record, then updates on focus', async () => {
  fetchDocument.mockResolvedValue(base);
  render(
    <MemoryRouter>
      <DocumentDetailPage slug="terms-of-service" />
    </MemoryRouter>,
  );
  expect(
    await screen.findByText('Last Updated: October 12, 2026'),
  ).toBeInTheDocument();
  expect(screen.getByText('Legal content from CMS')).toBeInTheDocument();
  fetchDocument.mockResolvedValue({
    ...base,
    updatedAt: '2026-11-05T02:00:00Z',
    content: [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'Published update' }],
      },
    ],
  });
  fireEvent.focus(window);
  expect(
    await screen.findByText('Last Updated: November 05, 2026'),
  ).toBeInTheDocument();
  expect(screen.getByText('Published update')).toBeInTheDocument();
});
it('only loads a remote iframe on request and switches to a frozen archived link', async () => {
  const document = {
    ...base,
    title: 'Charter',
    category: 'governance',
    externalUrl: 'https://drive.google.com/file/d/current/view',
    archives: [
      {
        id: 12,
        revision: '0.1',
        effectiveDate: '2026-09-09',
        url: 'https://drive.google.com/file/d/old/view',
      },
    ],
  };
  fetchDocument.mockResolvedValue(document);
  const { container } = render(
    <MemoryRouter>
      <DocumentDetailPage slug="charter" />
    </MemoryRouter>,
  );
  await screen.findByRole('heading', { name: 'Charter' });
  expect(container.querySelector('iframe')).toBeNull();
  fireEvent.change(screen.getByLabelText('Archived versions'), {
    target: {
      value: '0.1|2026-09-09|https://drive.google.com/file/d/old/view',
    },
  });
  fireEvent.click(
    screen.getByRole('button', { name: 'Load document preview' }),
  );
  expect(container.querySelector('iframe')).toHaveAttribute(
    'src',
    'https://drive.google.com/file/d/old/preview',
  );
  expect(screen.queryByText('Legal content from CMS')).not.toBeInTheDocument();
  fetchDocument.mockResolvedValue({
    ...document,
    archives: document.archives.map((item) => ({ ...item, id: 99 })),
  });
  fireEvent.focus(window);
  await waitFor(() => expect(fetchDocument).toHaveBeenCalledTimes(2));
  expect(screen.getByLabelText('Archived versions')).toHaveValue(
    '0.1|2026-09-09|https://drive.google.com/file/d/old/view',
  );
  expect(container.querySelector('iframe')).toHaveAttribute(
    'src',
    'https://drive.google.com/file/d/old/preview',
  );
});
it('never shows an archive selector for Protocol, even if stale archive data exists', async () => {
  fetchDocument.mockResolvedValue({
    ...base,
    title: 'Protocol',
    section: 'protocol',
    category: 'governance',
    archives: [
      {
        id: 1,
        url: 'https://example.com',
        revision: '0.0',
        effectiveDate: '2026-09-09',
      },
    ],
  });
  render(
    <MemoryRouter>
      <DocumentDetailPage slug="protocol" />
    </MemoryRouter>,
  );
  await waitFor(() =>
    expect(
      screen.getByRole('heading', { name: 'Protocol' }),
    ).toBeInTheDocument(),
  );
  expect(screen.queryByLabelText('Archived versions')).not.toBeInTheDocument();
});
