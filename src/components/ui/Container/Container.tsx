import { cn } from '@/lib/utils';

export interface ContainerProps {
  as?: keyof React.JSX.IntrinsicElements;
  size?: 'default' | 'narrow' | 'wide';
  className?: string;
  children: React.ReactNode;
}

const sizeClasses = {
  default: 'max-w-[1344px]',
  narrow: 'max-w-[960px]',
  wide: 'max-w-[1536px]',
};

export function Container({
  as: Tag = 'div',
  size = 'default',
  className,
  children,
}: ContainerProps) {
  return (
    <Tag className={cn('mx-auto w-full px-4 md:px-6 lg:px-8', sizeClasses[size], className)}>
      {children}
    </Tag>
  );
}
