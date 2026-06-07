import { cn } from '@/lib/utils';
import { PillButton } from '@/components/ui/PillButton';

const DEFAULT_GRADIENT =
  'linear-gradient(to right, #EE334E 0%, #F14D48 7%, #F56F40 16%, #F88F39 24%, #FCB131 33%, #C3AF38 41%, #79AB42 51%, #00A651 67%, #0081C8 100%)';

export interface CTABannerProps {
  /** Tiêu đề lớn của banner */
  title: string;
  /** Mô tả phụ dưới tiêu đề */
  description?: string;
  /** Nhãn nút hành động */
  ctaLabel: string;
  /** Đường dẫn nội bộ (react-router) cho nút */
  ctaTo?: string;
  /** Đường dẫn ngoài cho nút (mở tab mới) */
  ctaHref?: string;
  /** Handler khi không dùng to/href */
  onCtaClick?: () => void;
  /** Ghi đè gradient nền */
  gradient?: string;
  /** Độ mờ lớp phủ trắng (0–100), mặc định 45 */
  overlayOpacity?: number;
  /** Ẩn ngôi sao watermark */
  hideStar?: boolean;
  /** Class mở rộng cho thẻ section bọc ngoài */
  className?: string;
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
}: CTABannerProps) {
  const buttonAs = ctaTo ? 'router-link' : ctaHref ? 'a' : 'button';

  return (
    <section className={cn('mx-[288px] my-[60px]', className)}>
      <div className="rounded-[40px] overflow-hidden relative" style={{ background: gradient }}>
        {/* White overlay to soften into pastel */}
        <div className="absolute inset-0 bg-white" style={{ opacity: overlayOpacity / 100 }} />

        <div className="relative px-[60px] py-[40px] flex items-center justify-between gap-8">
          <div>
            <h2
              className="font-bold text-[36px] text-[#111111] mb-2"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            >
              {title}
            </h2>
            {description && (
              <p
                className="text-[18px] text-[#333333] font-normal max-w-[460px]"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              >
                {description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-[22px] flex-shrink-0">
            {!hideStar && (
              <img
                src="/images/common/decor/start.svg"
                alt=""
                aria-hidden="true"
                className="w-[120px] h-[120px] opacity-90 pointer-events-none"
              />
            )}
            <PillButton
              variant="white"
              size="md"
              as={buttonAs}
              to={ctaTo}
              href={ctaHref}
              onClick={onCtaClick}
            >
              {ctaLabel}
            </PillButton>
          </div>
        </div>
      </div>
    </section>
  );
}
