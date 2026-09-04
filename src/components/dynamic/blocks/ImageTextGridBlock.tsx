import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import type { ImageTextGridBlockData } from '@/types';

export function ImageTextGridBlock({ data }: { data: ImageTextGridBlockData }) {
  const cols = data.columns || 5;
  const gridColsClass =
    cols === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : cols === 3
      ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
      : cols === 4
      ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
      : cols === 6
      ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
      : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5';

  const shapeClass =
    data.imageShape === 'rounded'
      ? 'rounded-2xl aspect-video w-full max-w-[200px]'
      : data.imageShape === 'square'
      ? 'rounded-2xl aspect-square w-28 h-28 md:w-32 md:h-32'
      : 'rounded-full aspect-square w-28 h-28 md:w-32 md:h-32';

  return (
    <div className="text-center">
      {data.eyebrow && (
        <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-[#EE334E]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          {data.eyebrow}
        </span>
      )}

      {data.title && (
        <h2 className="font-heading text-[clamp(1.75rem,3vw,3rem)] font-semibold leading-tight text-black" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          {data.highlightTitle ? (
            <>
              <span className="bg-gradient-to-r from-[#E42C27] via-[#FBAB1A] to-[#10984F] bg-clip-text text-transparent">
                {data.highlightTitle}
              </span>
              <span> {data.title}</span>
            </>
          ) : (
            data.title
          )}
        </h2>
      )}

      {data.subtitle && (
        <p className="mt-3 text-base text-neutral-700 md:text-xl" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          {data.subtitle}
        </p>
      )}

      <div className={`mt-10 grid gap-8 xl:gap-7 ${gridColsClass}`}>
        {data.items?.map((item, i) => (
          <article key={i} className="flex flex-col items-center text-center">
            <div className={`overflow-hidden shadow-sm bg-neutral-100 ${shapeClass}`}>
              <ImageWithFallback src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
            </div>
            <h3 className="mt-5 text-[clamp(1rem,1.1vw,1.125rem)] font-semibold leading-tight text-black" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              {item.title}
            </h3>
            {item.description && (
              <p className="mt-2 text-[clamp(0.8125rem,0.85vw,0.875rem)] leading-relaxed text-neutral-600" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                {item.description}
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}