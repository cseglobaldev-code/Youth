import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/routes/paths';

export interface LogoProps {
  variant?: 'full' | 'mark';
  to?: string;
  className?: string;
  invert?: boolean;
}

export function Logo({ variant = 'full', to = ROUTES.HOME, className, invert = false }: LogoProps) {
  return (
    <Link
      to={to}
      className={cn(
        'inline-flex items-center',
        // Default height when caller doesn't set one (e.g. mobile max-w only)
        variant === 'full' ? 'h-9' : 'h-8',
        className
      )}
      aria-label="Y.O.U Home"
    >
      <img
        src="/images/common/brand/logo.svg"
        alt="Y.O.U"
        className={cn('h-full w-auto object-contain', invert && 'brightness-0 invert')}
      />
    </Link>
  );
}
