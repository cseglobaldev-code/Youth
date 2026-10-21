import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect, it, vi } from 'vitest';
import { AboutPage } from './AboutPage';
import { fetchPageBySlugOrId } from '@/api/pages';
import { en } from '@/locales/en';

vi.mock('@/api/pages', () => ({ fetchPageBySlugOrId: vi.fn() }));
vi.mock('@/context/LanguageContext', () => ({ useLanguage: () => ({ language: 'en', t: en }) }));
vi.mock('@/components/shared/CTABanner', () => ({ CTABanner: () => null }));

afterEach(() => { cleanup(); vi.clearAllMocks(); });

it('uses the Home-width stats frame in the About fallback and scopes single-line styling to About', async () => {
  vi.mocked(fetchPageBySlugOrId).mockResolvedValue(null);
  render(<MemoryRouter><AboutPage /></MemoryRouter>);
  const number = await screen.findByLabelText('1500 Volunteers from Global');
  const frame = number.closest('.you-stats-grid')!;
  expect(frame.closest('.about-page')).not.toBeNull();
  expect(frame.parentElement).toHaveClass('max-w-[95%]', 'sm:max-w-[85%]');
  expect(frame.parentElement).not.toHaveClass('lg:max-w-[1080px]');
});

it('also scopes stats loaded from CMS content to About', async () => {
  vi.mocked(fetchPageBySlugOrId).mockResolvedValue({
    id: 'about', title: 'About Us', slug: 'about-us', documentId: 'about-doc',
    contentBlocks: [{ __component: 'sections.stats-grid', id: 1, animated: false,
      variant: 'about', items: [{ label: 'Organizational Members', value: 20 }] }],
  });
  render(<MemoryRouter><AboutPage /></MemoryRouter>);
  const number = await screen.findByLabelText('20 Organizational Members');
  expect(number.closest('.you-stats-grid')?.closest('.about-page')).not.toBeNull();
});
