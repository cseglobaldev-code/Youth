import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders } from '@/app/AppProviders';
import { JoinModalProvider } from '@/components/modals/JoinModal/JoinModalProvider';
import { LeadershipPage } from './LeadershipPage';

vi.mock('@/hooks/useScrollReveal', () => ({
  useScrollReveal: () => ({ ref: vi.fn(), visible: true }),
}));

function renderPage() {
  return render(
    <AppProviders>
      <JoinModalProvider>
        <MemoryRouter>
          <LeadershipPage />
        </MemoryRouter>
      </JoinModalProvider>
    </AppProviders>
  );
}

function stubLeadershipFetch() {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ data: [] }),
  }));
}

describe('LeadershipPage sub-region tabs', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('renders Asia sub-region tabs by default', async () => {
    stubLeadershipFetch();
    renderPage();

    await waitFor(() => expect(screen.getByText('East Asia')).toBeInTheDocument());
    expect(screen.getByText('Southeast Asia')).toBeInTheDocument();
    expect(screen.getByText('North Asia')).toBeInTheDocument();
  }, 15000);

  it('renders Africa sub-region tabs after clicking the Africa continent pill', async () => {
    stubLeadershipFetch();
    renderPage();
    await waitFor(() => expect(screen.getByText('East Asia')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Africa' }));

    await waitFor(() => expect(screen.getByText('North Africa')).toBeInTheDocument());
    expect(screen.getByText('West Africa')).toBeInTheDocument();
    expect(screen.getByText('Southern Africa')).toBeInTheDocument();
    expect(screen.queryByText('Southeast Asia')).not.toBeInTheDocument();
  }, 15000);

  it('renders Europe sub-region tabs after clicking Europe', async () => {
    stubLeadershipFetch();
    renderPage();
    await waitFor(() => expect(screen.getByText('East Asia')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Europe' }));

    await waitFor(() => expect(screen.getByText('Northern Europe')).toBeInTheDocument());
    expect(screen.getByText('Western Europe')).toBeInTheDocument();
    expect(screen.queryByText('East Asia')).not.toBeInTheDocument();
  }, 15000);

  it('shows the empty state when a sub-region has no directors', async () => {
    stubLeadershipFetch();
    renderPage();

    await waitFor(() => expect(screen.getByText('East Asia')).toBeInTheDocument());
    expect(screen.getByText(/No directors listed for this region yet/)).toBeInTheDocument();
  }, 15000);
});