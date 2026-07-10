import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HeroSection } from './HeroSection';

const AUTO_ADVANCE_INTERVAL_MS = 5_000;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function createMatchMedia(reducedMotion: boolean): typeof window.matchMedia {
  return vi.fn().mockImplementation((query: string) => ({
    matches: reducedMotion && query === REDUCED_MOTION_QUERY,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }));
}

function getSlideIndicators() {
  return screen.getAllByRole('button', { name: /go to slide \d+/i });
}

describe('HeroSection carousel', () => {
  let initialMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    initialMatchMedia = window.matchMedia;
    window.matchMedia = createMatchMedia(false);
    vi.useFakeTimers();
  });

  afterEach(() => {
    window.matchMedia = initialMatchMedia;
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders the initial video poster without mounting an iframe', () => {
    render(<HeroSection />);

    expect(screen.getByRole('img', { name: 'Youth Organization Union video 1' })).toHaveAttribute(
      'src',
      'https://i.ytimg.com/vi/v4bPO0DfeC8/maxresdefault.jpg'
    );
    expect(screen.queryByTitle('Y.O.U Introduction Video')).not.toBeInTheDocument();
  });

  it('automatically advances at the approved interval and wraps from the last slide', () => {
    render(<HeroSection />);

    const indicators = getSlideIndicators();
    expect(indicators.length).toBeGreaterThan(1);
    expect(indicators[0]).toHaveAttribute('aria-current', 'true');

    act(() => {
      vi.advanceTimersByTime(AUTO_ADVANCE_INTERVAL_MS);
    });
    expect(indicators[1]).toHaveAttribute('aria-current', 'true');

    act(() => {
      vi.advanceTimersByTime(AUTO_ADVANCE_INTERVAL_MS * (indicators.length - 1));
    });
    expect(indicators[0]).toHaveAttribute('aria-current', 'true');
  });

  it('supports previous and next controls plus direct indicator navigation', () => {
    render(<HeroSection />);

    const indicators = getSlideIndicators();
    expect(indicators.length).toBeGreaterThan(1);

    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    expect(indicators[1]).toHaveAttribute('aria-current', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Previous slide' }));
    expect(indicators[0]).toHaveAttribute('aria-current', 'true');

    const lastIndicator = indicators[indicators.length - 1];
    fireEvent.click(lastIndicator);
    expect(lastIndicator).toHaveAttribute('aria-current', 'true');
  });

  it('mounts the selected video iframe on play and returns to a poster when navigating', () => {
    render(<HeroSection />);

    fireEvent.click(screen.getByRole('button', { name: /play video: youth organization union video 1/i }));
    expect(screen.getByTitle('Youth Organization Union video 1')).toHaveAttribute(
      'src',
      'https://www.youtube.com/embed/v4bPO0DfeC8?autoplay=1&playsinline=1&rel=0'
    );

    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    expect(screen.queryByTitle('Youth Organization Union video 1')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play video: youth organization union video 2/i })).toBeInTheDocument();
  });

  it('does not automatically advance when the user prefers reduced motion', () => {
    window.matchMedia = createMatchMedia(true);
    render(<HeroSection />);

    const [firstIndicator] = getSlideIndicators();
    expect(firstIndicator).toHaveAttribute('aria-current', 'true');

    act(() => {
      vi.advanceTimersByTime(AUTO_ADVANCE_INTERVAL_MS * 3);
    });
    expect(firstIndicator).toHaveAttribute('aria-current', 'true');
  });
});
