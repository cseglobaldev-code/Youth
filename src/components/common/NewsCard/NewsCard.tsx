import { cn } from '@/lib/utils';
import { Card } from '@/components/common/Card';
import type { NewsItem } from '@/types';

export interface NewsCardProps {
  item: NewsItem;
  layout?: 'vertical' | 'horizontal';
  className?: string;
}

export function NewsCard({ item, layout = 'vertical', className }: NewsCardProps) {
  return (
    <Card
      hoverable
      padding="none"
      className={cn(layout === 'horizontal' && 'flex flex-row', className)}
    >
      <div className={cn('bg-neutral-100 overflow-hidden', layout === 'horizontal' ? 'w-40 shrink-0' : 'h-44')}>
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        {item.category && (
          <span className="text-xs font-medium text-brand uppercase mb-1">{item.category}</span>
        )}
        <h3 className="font-semibold text-neutral-900 text-sm line-clamp-2 mb-2">{item.title}</h3>
        <p className="text-xs text-neutral-600 line-clamp-2 flex-1">{item.excerpt}</p>
        <time className="text-xs text-neutral-400 mt-2">{item.date}</time>
      </div>
    </Card>
  );
}
