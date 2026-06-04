import { cn } from '@/lib/utils';
import { tokens } from '@/config/theme/tokens';
import { Tag } from 'antd';

export interface SDGTagProps {
  sdgId: number;
  variant?: 'solid' | 'soft';
  size?: 'sm' | 'md';
  className?: string;
  style?: React.CSSProperties;
}

export function getSdgColor(sdgId: number): string {
  const colors = tokens.colors.sdg;
  return colors[sdgId as keyof typeof colors] ?? '#64748B';
}

export function SDGTag({ sdgId, variant = 'soft', size = 'sm', className, style: customStyle }: SDGTagProps) {
  const color = getSdgColor(sdgId);

  const baseStyle =
    variant === 'solid'
      ? {
          backgroundColor: color,
          color: '#fff',
          borderColor: color,
        }
      : {
          backgroundColor: `${color}15`, // ~9% opacity for soft background
          color: color,
          borderColor: `${color}30`, // Slightly more visible border
        };

  const sizeStyle = size === 'sm' 
    ? {
        padding: '2px 10px',
        fontSize: '12px',
        fontWeight: 500,
      }
    : {
        padding: '4px 14px',
        fontSize: '14px',
        fontWeight: 500,
      };

  return (
    <Tag
      className={cn(
        '!inline-flex !items-center !whitespace-nowrap !m-0 !rounded-full !border !transition-all hover:!opacity-80',
        className
      )}
      style={{
        ...baseStyle,
        ...sizeStyle,
        fontFamily: 'Open Sans, sans-serif',
        ...customStyle
      }}
    >
      #{`SDG${sdgId}`}
    </Tag>
  );
}
