import { cn } from '@/lib/utils';
import { Avatar as AntAvatar } from 'antd';

export interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  className?: string;
}

const sizeMap: Record<string, number> = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
  '2xl': 120,
  '3xl': 160,
  '4xl': 180,
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Avatar({ src, alt, size = 'md', className }: AvatarProps) {
  const antdSize = sizeMap[size];

  return (
    <AntAvatar
      src={src}
      size={antdSize}
      style={{ flexShrink: 0 }}
      className={cn('bg-neutral-200 text-neutral-600', className)}
    >
      {!src && getInitials(alt)}
    </AntAvatar>
  );
}
