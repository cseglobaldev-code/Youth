import { describe, beforeEach, afterEach, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders } from '@/app/AppProviders';
import { AppRouter } from '@/routes/AppRouter';

describe('Contact page route', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the contact page at /contact', () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/contact']}>
          <AppRouter />
        </MemoryRouter>
      </AppProviders>
    );

    expect(screen.getByRole('heading', { name: /contact y\.o\.u/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });
});
