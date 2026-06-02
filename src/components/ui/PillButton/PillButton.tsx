import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export type PillButtonVariant = 'solid' | 'outline' | 'white';
export type PillButtonSize = 'sm' | 'md' | 'lg';

export interface PillButtonProps {
  variant?: PillButtonVariant;
  size?: PillButtonSize;
  as?: 'button' | 'a' | 'router-link';
  to?: string;
  href?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EE334E] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

const variantClasses: Record<PillButtonVariant, string> = {
  // Nền đỏ đặc, chữ trắng (Join "Register")
  solid: 'bg-[#EE334E] text-white hover:opacity-90',
  // Viền đỏ, hover đổ nền đỏ (News/Team "View all")
  outline: 'border-2 border-[#EE334E] text-[#EE334E] hover:bg-[#EE334E] hover:text-white',
  // Nền trắng, chữ đỏ — dùng trên nền gradient/tối (CTA)
  white: 'bg-white text-[#EE334E] hover:bg-neutral-50',
};

const sizeClasses: Record<PillButtonSize, string> = {
  sm: 'px-6 py-2.5 text-[16px]',
  md: 'px-8 py-3 text-[18px]',
  lg: 'px-8 py-4 text-[20px]',
};

export function PillButton({
  variant = 'solid',
  size = 'md',
  as = 'button',
  to,
  href,
  fullWidth,
  disabled,
  className,
  children,
  onClick,
}: PillButtonProps) {
  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    className
  );

  if (as === 'router-link' && to) {
    return (
      <Link to={to} className={classes} onClick={onClick} style={{ fontFamily: 'Open Sans, sans-serif' }}>
        {children}
      </Link>
    );
  }

  if (as === 'a' && href) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        style={{ fontFamily: 'Open Sans, sans-serif' }}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled}
      onClick={onClick}
      style={{ fontFamily: 'Open Sans, sans-serif' }}
    >
      {children}
    </button>
  );
}
