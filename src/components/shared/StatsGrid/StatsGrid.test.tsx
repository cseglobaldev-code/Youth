import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { StatsGrid } from './StatsGrid';

const stats = [{ label: 'Organizations', value: 20 }, { label: 'Volunteers', value: 1500 }];
let observerCallback: IntersectionObserverCallback;
let now: number;
let frameId: number;
let frames: Map<number, FrameRequestCallback>;

beforeEach(() => {
  now = 0;
  frameId = 0;
  frames = new Map();
  vi.spyOn(performance, 'now').mockImplementation(() => now);
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: IntersectionObserverCallback) { observerCallback = callback; }
    observe() {}
    disconnect() {}
  });
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => { frames.set(++frameId, callback); return frameId; });
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => { frames.delete(id); });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

function visible(isIntersecting: boolean) {
  act(() => observerCallback([{ isIntersecting, intersectionRatio: isIntersecting ? 1 : 0 } as IntersectionObserverEntry], {} as IntersectionObserver));
}
function tick(time: number) {
  now = time;
  const callbacks = [...frames.values()];
  frames.clear();
  act(() => callbacks.forEach(callback => callback(now)));
}

it('waits until visible, eases over 3.5 seconds and reaches the exact targets', () => {
  render(<StatsGrid stats={stats} animated />);
  expect(frames.size).toBe(0);
  visible(true);
  tick(1750);
  expect(screen.getByLabelText('20 Organizations')).toHaveTextContent('+14');
  expect(screen.getByLabelText('1500 Volunteers')).toHaveTextContent('+1 060');
  tick(3400);
  expect(screen.getByLabelText('20 Organizations')).toHaveTextContent('+19');
  expect(screen.getByLabelText('1500 Volunteers')).toHaveTextContent('+1 498');
  tick(3500);
  expect(screen.getByLabelText('20 Organizations')).toHaveTextContent('+20');
  expect(screen.getByLabelText('1500 Volunteers')).toHaveTextContent('+1 500');
  expect(frames.size).toBe(0);
});

it('replays after scrolling away and back, including the About variant', () => {
  render(<StatsGrid stats={stats} variant="about" animated />);
  visible(true);
  tick(3500);
  expect(screen.getByText('+1 500')).toBeInTheDocument();
  visible(false);
  expect(screen.queryByText('+1 500')).not.toBeInTheDocument();
  visible(true);
  tick(5250);
  expect(screen.getByText('+1 060')).toBeInTheDocument();
  tick(7000);
  expect(screen.getByText('+1 500')).toBeInTheDocument();
});

it('shows final numbers without animation when disabled', () => {
  render(<StatsGrid stats={stats} />);
  expect(screen.getByLabelText('1500 Volunteers')).toHaveTextContent('+1 500');
  expect(frames.size).toBe(0);
});

it('respects reduced motion and shows final values immediately', () => {
  vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);
  render(<StatsGrid stats={stats} animated />);
  expect(screen.getByLabelText('1500 Volunteers')).toHaveTextContent('+1 500');
  expect(frames.size).toBe(0);
});
