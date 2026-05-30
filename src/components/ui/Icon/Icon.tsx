import { Icon as IconifyIcon } from '@iconify/react';
import { cn } from '@/lib/utils';

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  'aria-label'?: string;
}

export function Icon({
  name,
  size = 24,
  color,
  className,
  'aria-label': ariaLabel,
}: IconProps) {
  return (
    <IconifyIcon
      icon={name}
      width={size}
      height={size}
      color={color}
      className={cn('inline-block shrink-0', className)}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
    />
  );
}
