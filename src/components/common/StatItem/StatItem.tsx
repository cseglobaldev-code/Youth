import { cn } from '@/lib/utils';
import { formatStatValue } from '@/lib/utils';
import type { StatItem as StatItemType } from '@/types';

export interface StatItemCardProps {
  stat: StatItemType;
  className?: string;
}

export function StatItemCard({ stat, className }: StatItemCardProps) {
  return (
    <div className={cn('text-center', className)}>
      <div className="text-3xl md:text-4xl font-bold text-brand font-heading">
        {formatStatValue(stat)}
      </div>
      <div className="mt-1 text-sm text-neutral-600">{stat.label}</div>
    </div>
  );
}
