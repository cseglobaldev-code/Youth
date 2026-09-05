import { PillButton, type PillButtonVariant } from '@/components/ui/PillButton';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import type { MediaTextBlockData } from '@/types';

function toPillVariant(variant?: string): PillButtonVariant {
  if (variant === 'outline' || variant === 'white') return variant;
  return 'solid';
}

export function MediaTextBlock({ data }: { data: MediaTextBlockData }) {
  const isLeft = data.mediaPosition === 'left';
  const isExt = data.button?.isExternal || data.button?.url?.startsWith('http');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
      <div className={`flex flex-col gap-4 ${isLeft ? 'lg:order-2' : 'lg:order-1'}`}>
        {data.eyebrow && (
          <span className="text-sm font-semibold uppercase tracking-wider text-[#EE334E]">
            {data.eyebrow}
          </span>
        )}
        <h2 className="font-semibold text-2xl md:text-4xl text-neutral-900 leading-tight" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          {data.title}
        </h2>
        <p className="text-neutral-600 text-base md:text-lg leading-relaxed whitespace-pre-line" style={{ fontFamily: 'Inter, sans-serif' }}>
          {data.content}
        </p>
        {data.button && (
          <div className="mt-2">
            <PillButton
              variant={toPillVariant(data.button.variant)}
              as={isExt ? 'a' : 'router-link'}
              to={!isExt && data.button.url ? data.button.url : undefined}
              href={isExt && data.button.url ? data.button.url : undefined}
            >
              {data.button.label}
            </PillButton>
          </div>
        )}
      </div>

      <div className={`w-full ${isLeft ? 'lg:order-1' : 'lg:order-2'}`}>
        <div className="overflow-hidden rounded-3xl aspect-[4/3] shadow-sm bg-neutral-100">
          <ImageWithFallback src={data.mediaUrl} alt={data.title} className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  );
}