import { Icon } from '@/components/ui/Icon';
import type { FeatureGridBlockData } from '@/types';

export function FeatureGridBlock({ data }: { data: FeatureGridBlockData }) {
  const cols = data.columns || 4;
  const gridColsClass =
    cols === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : cols === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <div className="text-center">
      {data.eyebrow && (
        <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-[#EE334E]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          {data.eyebrow}
        </span>
      )}

      {data.title && (
        <h2 className="font-heading text-[clamp(1.75rem,3vw,3rem)] font-semibold leading-tight text-black" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          <span>{data.title} </span>
          {data.highlightTitle && (
            <span className="bg-gradient-to-r from-[#E42C27] via-[#FBAB1A] to-[#10984F] bg-clip-text text-transparent">
              {data.highlightTitle}
            </span>
          )}
        </h2>
      )}

      {data.subtitle && (
        <p className="mt-3 text-base text-neutral-700 md:text-xl" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          {data.subtitle}
        </p>
      )}

      <div className={`mt-8 grid gap-4 lg:gap-5 ${gridColsClass}`}>
        {data.items?.map((item, i) => (
          <article
            key={i}
            className={`rounded-2xl border border-neutral-100 bg-white px-5 py-8 shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
              item.active ? 'bg-[#F2F7FF]' : ''
            }`}
          >
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#2998FF] shadow-sm">
              <Icon name={item.icon || 'lucide:badge-check'} size={30} />
            </div>
            <h3 className="text-[clamp(1rem,1.1vw,1.125rem)] font-semibold text-black" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              {item.title}
            </h3>
            <p className="mt-3 text-[clamp(0.8125rem,0.85vw,0.875rem)] leading-relaxed text-neutral-700" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}