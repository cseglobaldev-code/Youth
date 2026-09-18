import { cn } from '@/lib/utils';
import { Tag } from 'antd';
import { getSdgColor } from './getSdgColor';

export interface SDGTagProps {
  sdgId: number;
  variant?: 'solid' | 'soft';
  size?: 'sm' | 'md';
  className?: string;
  style?: React.CSSProperties;
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
        padding: '3px 11px',
        fontSize: '12px',
        fontWeight: 500,
        lineHeight: '16px',
      }
    : {
        padding: '4px 12px',
        fontSize: '13px',
        fontWeight: 500,
        lineHeight: '18px',
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
