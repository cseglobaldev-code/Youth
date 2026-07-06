import { Button } from '@/components/ui/Button';

export interface SupportCTAProps {
  /** Where the button links (donation page, org profile, external link). */
  href: string;
  /** Button label. */
  title?: string;
  /** Italic caption shown beside the button. */
  description?: string;
  className?: string;
}

export function SupportCTA({
  href,
  title = 'Support our Mission',
  description = 'Send your spiritual or financial support to this organization',
  className,
}: SupportCTAProps) {
  return (
    <div
      className={['relative flex-shrink-0 pb-0 xl:pb-[80px]', className].filter(Boolean).join(' ')}
    >
      <div className="flex flex-col-reverse items-center gap-4 text-center xl:flex-row xl:items-center xl:gap-[28px] xl:text-right">
        {/* Caption — stacks under the button below xl, sits left of it on desktop */}
        <div className="max-w-[200px] xl:w-[clamp(200px,18vw,320px)] xl:max-w-none xl:flex-shrink-0">
          <span
            className="block italic text-black"
            style={{
              fontFamily: 'Open Sans, sans-serif',
              fontSize: 'clamp(0.8125rem, 1.04vw, 1.25rem)',
              lineHeight: '150%',
            }}
          >
            {description}
          </span>
        </div>

        {/* Support button — brand-outlined pill matching the reference design */}
        <Button
          as="a"
          href={href}
          variant="outline"
          className="!rounded-full !px-[clamp(20px,2.5vw,44px)] !py-[clamp(10px,1vw,18px)] !text-[clamp(0.9375rem,1.15vw,1.375rem)] !font-semibold whitespace-nowrap"
        >
          {title}
        </Button>
      </div>

      {/* Decorative dashed rainbow arrow pointing from the caption up at the button. */}
      <div
        className="absolute pointer-events-none left-[0%] top-[42%] w-[clamp(90px,26vw,160px)] xl:left-[clamp(30px,2.5vw,50px)] xl:top-[clamp(64px,5vw,96px)] xl:w-[clamp(180px,15vw,280px)]"
      >
        <svg
          width="100%"
          height="auto"
          viewBox="0 0 320 130"
          preserveAspectRatio="xMinYMin meet"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="supportCtaArrowRainbow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EE334E" />
              <stop offset="33%" stopColor="#FCB131" />
              <stop offset="67%" stopColor="#00A651" />
              <stop offset="100%" stopColor="#0081C8" />
            </linearGradient>
          </defs>

          <path
            d="M 10,110 C 60,95 90,85 120,80 C 135,78 155,62 148,40 C 138,15 122,30 138,55 C 150,80 185,82 215,70 C 235,62 255,52 275,42"
            stroke="url(#supportCtaArrowRainbow)"
            strokeWidth="2.5"
            strokeDasharray="6,5"
            strokeLinecap="round"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />

          <path
            d="M 260,37 L 275,42 L 265,55"
            stroke="#0081C8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}
