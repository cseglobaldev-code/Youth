import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { ImageCarousel } from './ImageCarousel';

vi.mock('@/components/ui/Icon', () => ({ Icon: () => null }));
afterEach(() => { cleanup(); vi.useRealTimers(); });

it('rotates through all six covers and opens the supplied matching Instagram post', () => {
  vi.useFakeTimers();
  render(<ImageCarousel />);
  const posts = ['DcYhCTxu1Zn', 'DcIAzE5u18F', 'DaU-FLFurYg', 'DacNm3yOdN7', 'DaWpYpjBc3j', 'DawrQ3su4Fy'];
  for (let index = 0; index < 6; index++) {
    expect(screen.getByRole('img')).toHaveAttribute('src', `/images/home/ambassadors/YOU-Ambassador-${index + 1}.png`);
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toContain(`/p/${posts[index]}/`);
    expect(link).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('group', { name: `Slide ${index + 1} of 6` })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(5000));
  }
  expect(screen.getByRole('img')).toHaveAttribute('src', '/images/home/ambassadors/YOU-Ambassador-1.png');
});

it('pauses automatic rotation and supports manual slide selection', () => {
  vi.useFakeTimers();
  render(<ImageCarousel />);
  fireEvent.click(screen.getByRole('button', { name: 'Pause automatic slide rotation' }));
  act(() => vi.advanceTimersByTime(10000));
  expect(screen.getByRole('group', { name: 'Slide 1 of 6' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Go to slide 3' }));
  expect(screen.getByRole('link').getAttribute('href')).toContain('/p/DaU-FLFurYg/');
  fireEvent.click(screen.getByRole('button', { name: 'Resume automatic slide rotation' }));
  act(() => vi.advanceTimersByTime(5000));
  expect(screen.getByRole('group', { name: 'Slide 4 of 6' })).toBeInTheDocument();
});
