import { cn } from '@/lib/utils';

export interface CardProps {
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

export function Card({ hoverable, padding = 'md', className, children, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-card border border-neutral-200 overflow-hidden',
        hoverable && 'transition-shadow duration-200 hover:shadow-lg cursor-pointer',
        paddingClasses[padding],
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
    </div>
  );
}
