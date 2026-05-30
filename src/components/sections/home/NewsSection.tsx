import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { ICONS } from '@/config/icons';
import { Button } from '@/components/ui/Button';
import type { NewsItem } from '@/types';

interface NewsSectionProps {
  items: NewsItem[];
}

function NewsRow({ item }: { item: NewsItem }) {
  return (
    <div className="flex gap-4 py-5 border-b border-neutral-200 last:border-0 hover:bg-neutral-50 transition-colors cursor-pointer">
      <div className="w-[203px] h-[140px] flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100">
        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <h4 className="font-semibold text-neutral-900 text-base leading-snug mb-2 line-clamp-2">
            {item.title}
          </h4>
          <div className="flex items-center gap-4 text-sm text-neutral-500">
            <span className="flex items-center gap-1">
              <Icon name={ICONS.mapPin} size={16} />
              {item.category || 'Global'}
            </span>
            <span className="flex items-center gap-1">
              <Icon name="solar:user-linear" size={16} />
              Y.O.U Team
            </span>
          </div>
        </div>
        <p className="text-sm text-neutral-600 line-clamp-2 mt-2">{item.excerpt}</p>
      </div>
    </div>
  );
}

export function NewsSection({ items }: NewsSectionProps) {
  const featured = items[0];
  const rest = items.slice(1, 5);

  return (
    <section className="py-16 lg:py-24 bg-white">
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-neutral-900">
            Latest <span className="text-brand">News</span>
          </h2>
          <Button as="router-link" to="/news" variant="outline" size="sm">
            View all
          </Button>
        </div>

        {/* 2-col layout: featured left + list right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured article */}
          {featured && (
            <div className="flex flex-col cursor-pointer group">
              <div className="rounded-2xl overflow-hidden bg-neutral-100 aspect-[652/436] mb-6">
                <img
                  src={featured.imageUrl}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 text-xl leading-snug mb-3">
                  {featured.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-neutral-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Icon name={ICONS.mapPin} size={16} />
                    Asia, Africa
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="solar:user-linear" size={16} />
                    Y.O.U Team
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="iconoir:clock" size={16} />
                    {featured.date}
                  </span>
                </div>
                <p className="text-sm text-neutral-600 line-clamp-2">{featured.excerpt}</p>
                <button className="mt-4 flex items-center gap-1 text-brand text-sm font-medium hover:underline">
                  See more
                  <Icon name="lucide:arrow-right" size={16} />
                </button>
              </div>
            </div>
          )}

          {/* News list */}
          <div className="flex flex-col divide-y divide-neutral-200">
            {rest.map((item) => (
              <NewsRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
