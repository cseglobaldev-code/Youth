import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { PolicyDocumentsPage } from './PolicyDocumentsPage';
const fetchDocuments = vi.hoisted(() => vi.fn());
vi.mock('@/api/documents', () => ({ fetchDocuments }));
const fetchGlobalSettings = vi.hoisted(() => vi.fn());
vi.mock('@/api/global', () => ({ fetchGlobalSettings, DEFAULT_GLOBAL_SETTINGS: {} }));
beforeEach(() => {
  fetchGlobalSettings.mockResolvedValue({});
});
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
it('links the Media Library right after Annual Reports to the external photo and video libraries', async () => {
  fetchDocuments.mockResolvedValue([]);
  fetchGlobalSettings.mockResolvedValue({
    photoLibraryUrl: 'https://www.flickr.com/photos/you/albums',
    videoLibraryUrl: 'https://www.youtube.com/@you/playlists',
  });
  render(
    <MemoryRouter>
      <PolicyDocumentsPage />
    </MemoryRouter>,
  );
  const mediaLibrary = await screen.findByRole('region', { name: 'Media Library' });
  expect(
    await within(mediaLibrary).findByRole('link', { name: 'Visit the Photo Library' }),
  ).toHaveAttribute('href', 'https://www.flickr.com/photos/you/albums');
  expect(
    within(mediaLibrary).getByRole('link', { name: 'Visit the Video Library' }),
  ).toHaveAttribute('href', 'https://www.youtube.com/@you/playlists');
  const sidebar = screen.getByRole('navigation', { name: 'Document categories' });
  const labels = within(sidebar).getAllByRole('button').map((button) => button.textContent);
  expect(labels.slice(-2)).toEqual(['Annual Reports', 'Media Library']);
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
