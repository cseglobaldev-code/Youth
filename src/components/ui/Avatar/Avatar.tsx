import { cn } from '@/lib/utils';
import { useState } from 'react';

export interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-lg',
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
  const [error, setError] = useState(false);

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full bg-neutral-200 overflow-hidden',
        sizeClasses[size],
        className
      )}
    >
      {src && !error ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <span className="font-semibold text-neutral-600">{getInitials(alt)}</span>
      )}
    </div>
  );
}
