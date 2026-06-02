import { cn } from '@/lib/utils';
import { tokens } from '@/config/theme/tokens';
import { Tag } from 'antd';

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

  const style =
    variant === 'solid'
      ? {
          backgroundColor: color,
          color: '#fff',
          borderColor: color,
          borderRadius: '9999px',
          fontWeight: size === 'sm' ? 400 : 500,
          fontSize: size === 'sm' ? '0.75rem' : '0.875rem',
        }
      : {
          backgroundColor: `${color}20`,
          color,
          borderColor: `${color}20`,
          borderRadius: '9999px',
          fontWeight: size === 'sm' ? 400 : 500,
          fontSize: size === 'sm' ? '0.75rem' : '0.875rem',
        };

  return (
    <Tag
      className={cn('!inline-flex !items-center !whitespace-nowrap', className)}
      style={style}
    >
      #{`SDG${sdgId}`}
    </Tag>
  );
}
