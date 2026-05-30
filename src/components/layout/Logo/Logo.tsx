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
    <Link to={to} className={cn('inline-flex items-center', className)} aria-label="Y.O.U Home">
      <img
        src="/logo.png"
        alt="Y.O.U"
        className={cn(
          'w-auto object-contain',
          variant === 'full' ? 'h-9' : 'h-8',
          invert && 'brightness-0 invert'
        )}
      />
    </Link>
  );
}
