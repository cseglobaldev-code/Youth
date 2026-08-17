import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AppProviders } from '@/app/AppProviders';
import { JoinModalProvider } from '@/components/modals/JoinModal';
import { DynamicPage } from './DynamicPage';

const MOCK_PAGE_DATA = {
  id: '1',
  documentId: 'page-doc-1',
  title: 'Youth Summit 2026',
  slug: 'youth-summit-2026',
  seo: {
    metaTitle: 'Youth Summit 2026 Event',
  },
  contentBlocks: [
    {
      id: 1,
      __component: 'sections.hero',
      title: 'Uniting Youth',
      highlightTitle: 'Shaping Tomorrow',
      layoutVariant: 'centered',
    },
    {
      id: 2,
      __component: 'sections.cta-banner',
      title: 'Ready to Make an Impact?',
      ctaLabel: 'Register Now',
    },
  ],
};

function renderDynamicPage(initialEntry: string) {
  return render(
    <AppProviders>
      <JoinModalProvider>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Routes>
            <Route path="pages/:slug" element={<DynamicPage />} />
          </Routes>
        </MemoryRouter>
      </JoinModalProvider>
    </AppProviders>
  );
}

describe('DynamicPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('renders blocks dynamically when page data is fetched', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [MOCK_PAGE_DATA] }),
    }));

    renderDynamicPage('/pages/youth-summit-2026');

    await waitFor(() => {
      expect(screen.getByText(/Uniting Youth/)).toBeInTheDocument();
      expect(screen.getByText(/Shaping Tomorrow/)).toBeInTheDocument();
      expect(screen.getByText(/Ready to Make an Impact\?/)).toBeInTheDocument();
    });
  });

  it('renders NotFoundPage when page is not found', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    }));

    renderDynamicPage('/pages/non-existent-slug');

    await waitFor(() => {
      expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
    });
  });

  it('displays the preview banner when preview=1 query param is set', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [MOCK_PAGE_DATA] }),
    }));

    renderDynamicPage('/pages/youth-summit-2026?preview=1');

    await waitFor(() => {
      expect(screen.getByText(/Preview Mode:/i)).toBeInTheDocument();
    });
  });
});