import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect, it, vi } from 'vitest';
import { PolicyDocumentsPage } from './PolicyDocumentsPage';
const fetchDocuments = vi.hoisted(() => vi.fn());
vi.mock('@/api/documents', () => ({ fetchDocuments }));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
it('groups all requested sections and the five Careers continents, with editable annual report covers', async () => {
  fetchDocuments.mockResolvedValue([
    {
      id: 'c',
      title: 'Charter 2026',
      category: 'governance',
      section: 'charter',
      fileType: 'pdf',
      fileUrl: '',
      revision: '0.0',
      effectiveDate: '2026-09-09',
    },
    {
      id: 'a',
      title: 'Asia Director',
      category: 'membership',
      section: 'careers',
      continent: 'Asia',
      fileType: 'pdf',
      fileUrl: '',
    },
    {
      id: 'r',
      title: 'Report 2026',
      category: 'annual-reports',
      section: 'annual-report',
      coverImageUrl: '/uploads/report.jpg',
      revision: '1.0',
      effectiveDate: '2026-09-09',
    },
  ]);
  render(
    <MemoryRouter>
      <PolicyDocumentsPage />
    </MemoryRouter>,
  );
  await screen.findByText('Charter 2026');
  const membership = screen.getByRole('region', {
    name: 'Membership Documents',
  });
  for (const continent of ['Africa', 'America', 'Asia', 'Australia', 'Europe'])
    expect(within(membership).getByText(continent)).toBeInTheDocument();
  expect(screen.getByRole('img', { name: 'Report 2026' })).toHaveAttribute(
    'src',
    '/uploads/report.jpg',
  );
  expect(screen.getByText('v1.0 - September 09, 2026')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Membership Documents' }));
  expect(screen.queryByText('Charter 2026')).not.toBeInTheDocument();
  expect(
    screen.queryByRole('img', { name: 'Report 2026' }),
  ).not.toBeInTheDocument();
});
it('does not restore a bundled JD when no published documents remain', async () => {
  fetchDocuments.mockResolvedValue([]);
  render(
    <MemoryRouter>
      <PolicyDocumentsPage />
    </MemoryRouter>,
  );
  await screen.findAllByText('No published documents available yet.');
  expect(
    screen.queryByText('Job Description for Continental Directors'),
  ).not.toBeInTheDocument();
});
