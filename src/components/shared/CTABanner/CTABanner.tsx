import { cn } from '@/lib/utils';
import { useJoinModal } from '@/components/modals/JoinModal';
import { PillButton } from '@/components/ui/PillButton';

const DEFAULT_GRADIENT =
  'linear-gradient(to right, #EE334E 0%, #F14D48 7%, #F56F40 16%, #F88F39 24%, #FCB131 33%, #C3AF38 41%, #79AB42 51%, #00A651 67%, #0081C8 100%)';

export interface CTABannerProps {
  /** Large banner title */
  title: string;
  /** Supporting description under the title */
  description?: string;
  /** CTA button label */
  ctaLabel: string;
  /** Internal route path (react-router) for the button */
  ctaTo?: string;
  /** External URL for the button (opens in a new tab) */
  ctaHref?: string;
  /** Click handler when not using ctaTo/ctaHref */
  onCtaClick?: () => void;
  /** Override background gradient */
  gradient?: string;
  /** White overlay opacity (0–100), defaults to 45 */
  overlayOpacity?: number;
  /** Hide the star watermark */
  hideStar?: boolean;
  /** Extra class for the outer section wrapper */
  className?: string;
  /** Override the inner banner's max-width (defaults to 1344px) */
  widthClassName?: string;
}

export function CTABanner({
  title,
  description,
  ctaLabel,
  ctaTo,
  ctaHref,
  onCtaClick,
  gradient = DEFAULT_GRADIENT,
  overlayOpacity = 45,
  hideStar = false,
  className,
  widthClassName = 'max-w-[1344px]',
}: CTABannerProps) {
  const { openJoin } = useJoinModal();
  const buttonAs = ctaTo ? 'router-link' : ctaHref ? 'a' : 'button';
  const handleCtaClick = onCtaClick ?? openJoin;

  return (
    <section className={cn('mx-4 my-12 sm:mx-6 md:my-16 lg:mx-8 lg:my-[7.5rem]', className)}>
      <div className={cn('mx-auto rounded-3xl lg:rounded-[40px] overflow-hidden relative', widthClassName)} style={{ background: gradient }}>
        {/* White overlay to soften into pastel */}
        <div className="absolute inset-0 bg-white" style={{ opacity: overlayOpacity / 100 }} />

        <div className="relative px-5 py-7 sm:px-8 sm:py-8 lg:px-[60px] lg:py-[40px] flex flex-col md:flex-row md:items-center md:justify-between gap-6 lg:gap-8 text-center md:text-left">
          <div className="min-w-0">
            <h2
              className="font-bold text-2xl sm:text-3xl lg:text-[36px] text-[#111111] mb-2 leading-tight"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            >
              {title}
            </h2>
            {description && (
              <p
                className="text-sm sm:text-base lg:text-[18px] text-[#333333] font-normal max-w-[460px] mx-auto md:mx-0 leading-relaxed"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              >
                {description}
              </p>
            )}
          </div>
          <div className="flex items-center justify-center md:justify-end gap-3 sm:gap-4 lg:gap-[22px] flex-shrink-0">
            {!hideStar && (
              <img
                src="/images/common/decor/start.svg"
                alt=""
                aria-hidden="true"
                className="hidden sm:block w-16 h-16 lg:w-[120px] lg:h-[120px] opacity-90 pointer-events-none"
              />
            )}
            <PillButton
              variant="white"
              size="md"
              as={buttonAs}
              to={ctaTo}
              href={ctaHref}
              onClick={handleCtaClick}
              className="!bg-white !px-6 !py-2.5 !text-base transition-all duration-200 hover:!bg-white hover:opacity-90 active:scale-[0.98] lg:!px-8 lg:!py-3 lg:!text-[18px]"
            >
              {ctaLabel}
            </PillButton>
          </div>
        </div>
      </div>
    </section>
  );
}
