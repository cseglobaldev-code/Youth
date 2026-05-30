import { cn } from '@/lib/utils';
import { tokens } from '@/config/theme/tokens';

export interface SDGTagProps {
  sdgId: number;
  variant?: 'solid' | 'soft';
  size?: 'sm' | 'md';
  className?: string;
}

export function getSdgColor(sdgId: number): string {
  const colors = tokens.colors.sdg;
  return colors[sdgId as keyof typeof colors] ?? '#64748B';
}

export function SDGTag({ sdgId, variant = 'solid', size = 'sm', className }: SDGTagProps) {
  const color = getSdgColor(sdgId);

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  const style =
    variant === 'solid'
      ? { backgroundColor: color, color: '#fff' }
      : { backgroundColor: `${color}20`, color };

  return (
    <span
      className={cn('inline-flex items-center rounded-pill font-medium whitespace-nowrap', sizeClasses, className)}
      style={style}
    >
      #{`SDG${sdgId}`}
    </span>
  );
}
