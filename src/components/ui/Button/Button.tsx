import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  as?: 'button' | 'a' | 'router-link';
  to?: string;
  href?: string;
  leftIcon?: string;
  rightIcon?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

const variantClasses = {
  primary: 'bg-brand text-white hover:bg-brand-dark rounded-btn shadow-sm',
  secondary: 'bg-accent text-neutral-900 hover:bg-accent-dark rounded-btn shadow-sm',
  outline: 'border-2 border-brand text-brand hover:bg-brand-50 rounded-btn',
  ghost: 'text-neutral-700 hover:bg-neutral-100 rounded-btn',
  link: 'text-brand hover:text-brand-dark underline-offset-4 hover:underline p-0',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  as = 'button',
  to,
  href,
  leftIcon,
  rightIcon,
  fullWidth,
  disabled,
  className,
  children,
  onClick,
}: ButtonProps) {
  const classes = cn(
    baseClasses,
    variantClasses[variant],
    variant !== 'link' && sizeClasses[size],
    fullWidth && 'w-full',
    className
  );

  const content = (
    <>
      {leftIcon && <Icon name={leftIcon} size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />}
      {children}
      {rightIcon && <Icon name={rightIcon} size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />}
    </>
  );

  if (as === 'router-link' && to) {
    return (
      <Link to={to} className={classes} onClick={onClick}>
        {content}
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
      >
        {content}
      </a>
    );
  }

  return (
    <button className={classes} disabled={disabled} onClick={onClick} type="button">
      {content}
    </button>
  );
}
