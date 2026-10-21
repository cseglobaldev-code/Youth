import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { DocumentRow } from './DocumentRow';
import { MEMBERSHIP_DOCUMENTS } from '@/data/membershipDocuments';

afterEach(cleanup);

it('renders a plain row with a gradient separator and keeps both PDF actions', () => {
  const { container } = render(<DocumentRow document={MEMBERSHIP_DOCUMENTS[0]} />);
  const row = container.firstElementChild!;
  expect(row).not.toHaveAttribute('style');
  expect(row.className).toContain('after:bg-gradient-to-r');
  expect(screen.getByText('Revision 00 - September 09, 2026')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Download/ })).toHaveAttribute('href', MEMBERSHIP_DOCUMENTS[0].fileUrl);
  expect(screen.getByRole('link', { name: /Open/ })).toHaveAttribute('target', '_blank');
});

it('handles revision metadata without a date', () => {
  render(<DocumentRow document={{ ...MEMBERSHIP_DOCUMENTS[0], updatedAt: undefined }} />);
  expect(screen.getByText('Revision 00')).toBeInTheDocument();
});
