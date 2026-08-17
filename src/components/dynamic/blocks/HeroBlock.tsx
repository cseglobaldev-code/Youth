import { PillButton, type PillButtonVariant } from '@/components/ui/PillButton';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import type { HeroBlockData } from '@/types';

function toPillVariant(variant?: string): PillButtonVariant {
  if (variant === 'outline' || variant === 'white') return variant;
  return 'solid';
}

export function HeroBlock({ data }: { data: HeroBlockData }) {
  const isSplit = data.layoutVariant === 'split-media';

  return (
    <div className={isSplit ? 'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center' : 'max-w-4xl mx-auto text-center'}>
      <div className="flex flex-col gap-4">
        {data.eyebrow && (
          <span className="text-sm font-semibold uppercase tracking-wider text-[#EE334E]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            {data.eyebrow}
          </span>
        )}

        <h1 className="font-semibold text-neutral-900 text-[clamp(2.25rem,4.5vw,4.5rem)] leading-[110%]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          <span>{data.title} </span>
          {data.highlightTitle && (
            <span className="bg-gradient-to-r from-[#E42C27] via-[#FBAB1A] to-[#10984F] bg-clip-text text-transparent">
              {data.highlightTitle}
            </span>
          )}
        </h1>

        {data.description && (
          <p className="text-neutral-600 text-[clamp(1rem,1.25vw,1.375rem)] font-normal leading-relaxed mt-2" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            {data.description}
          </p>
        )}

        {data.buttons && data.buttons.length > 0 && (
          <div className={`mt-4 flex flex-wrap gap-4 ${isSplit ? 'justify-start' : 'justify-center'}`}>
            {data.buttons.map((btn, idx) => (
              <PillButton
                key={idx}
                variant={toPillVariant(btn.variant)}
                size={btn.size || 'md'}
                as={btn.isExternal || btn.url.startsWith('http') ? 'a' : 'router-link'}
                to={!btn.isExternal && !btn.url.startsWith('http') ? btn.url : undefined}
                href={btn.isExternal || btn.url.startsWith('http') ? btn.url : undefined}
              >
                {btn.label}
              </PillButton>
            ))}
          </div>
        )}
      </div>

      {(data.imageUrl || data.youtubeVideoId) && (
        <div className={isSplit ? 'w-full' : 'mt-8 lg:mt-12 w-full max-w-5xl mx-auto'}>
          <div className="overflow-hidden rounded-3xl lg:rounded-[40px] aspect-[16/9] shadow-md bg-neutral-100">
            {data.youtubeVideoId ? (
              <iframe
                className="h-full w-full border-0"
                src={`https://www.youtube.com/embed/${data.youtubeVideoId}`}
                title={data.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <ImageWithFallback src={data.imageUrl} alt={data.title} className="h-full w-full object-cover" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}