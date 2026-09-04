import { CTABanner } from '@/components/shared/CTABanner';
import type { CTABannerBlockData } from '@/types';

const THEME_MAP: Record<string, string> = {
  'rainbow-gradient': 'linear-gradient(to right, #EE334E 0%, #F14D48 7%, #F56F40 16%, #F88F39 24%, #FCB131 33%, #C3AF38 41%, #79AB42 51%, #00A651 67%, #0081C8 100%)',
  'blue-gradient': 'linear-gradient(to right, #005D9A 0%, #1771B9 50%, #2980B9 100%)',
  'solid-brand': '#1771B9',
  'white-box': '#FFFFFF',
};

export function CTABannerBlock({ data }: { data: CTABannerBlockData }) {
  return (
    <CTABanner
      title={data.title}
      description={data.description}
      ctaLabel={data.ctaLabel}
      ctaTo={data.ctaUrl && !data.ctaUrl.startsWith('http') ? data.ctaUrl : undefined}
      ctaHref={data.ctaUrl && data.ctaUrl.startsWith('http') ? data.ctaUrl : undefined}
      gradient={THEME_MAP[data.theme || 'rainbow-gradient']}
      hideStar={data.hideStar}
      className="my-0"
    />
  );
}