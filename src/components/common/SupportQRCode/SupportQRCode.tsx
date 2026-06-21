import { QRCodeSVG } from 'qrcode.react';

const QR_CONIC =
  'conic-gradient(from 0deg at 50% 50%, #EE334E 0deg, #FCB131 90deg, #00A651 180deg, #0081C8 270deg, #EE334E 360deg)';

export interface SupportQRCodeProps {
  value: string;
  title?: string;
  description?: string;
  className?: string;
}

export function SupportQRCode({
  value,
  title = 'Support our Mission',
  description = 'Send your spiritual or financial support to this organization',
  className,
}: SupportQRCodeProps) {
  return (
    <div
      className={['relative flex-shrink-0 pb-0 xl:pb-[100px]', className].filter(Boolean).join(' ')}
    >
      <div className="flex flex-col-reverse items-center gap-2 text-center xl:flex-row xl:items-center xl:gap-[18px] xl:text-right">
        {/* Text block — compact under the QR below xl, fixed clamp width on desktop */}
        <div className="max-w-[150px] sm:max-w-[200px] xl:w-[clamp(160px,16vw,307px)] xl:max-w-none xl:flex-shrink-0">
          <span
            className="block font-semibold italic text-black"
            style={{
              fontFamily: 'Open Sans, sans-serif',
              fontSize: 'clamp(0.75rem, 1.04vw, 1.25rem)',
              lineHeight: '150%',
            }}
          >
            {title}
          </span>
          <span
            className="hidden sm:block italic text-black"
            style={{
              fontFamily: 'Open Sans, sans-serif',
              fontSize: 'clamp(0.6875rem, 0.94vw, 1.125rem)',
              lineHeight: '150%',
            }}
          >
            {description}
          </span>
        </div>

        {/* QR box — square via aspect ratio, QR SVG scales with the box.
            Rotation only on desktop so the tilted corners never overflow
            narrow viewports. */}
        <div className="flex-shrink-0 rotate-[15deg]" style={{ transformOrigin: 'center' }}>
          <div className="animate-float-y">
            <div
              className="box-border rounded-xl p-1.5 lg:rounded-2xl lg:p-2 w-[clamp(80px,11vw,168px)] xl:w-[clamp(120px,8.75vw,168px)]"
              style={{ background: QR_CONIC }}
            >
              <div className="flex aspect-square w-full items-center justify-center rounded-[8px] lg:rounded-[11px] bg-white p-1 lg:p-1.5">
                <QRCodeSVG
                  value={value}
                  size={100}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative dashed rainbow arrow.
          Below xl the layout is stacked (QR on top, text below) so the arrow
          sits lower-left and points up at the QR. From xl it returns to the
          desktop position (over the caption text, pointing right at the QR). */}
      <div
        className="absolute pointer-events-none left-[0%] top-[38%] w-[clamp(80px,26vw,150px)] xl:left-[clamp(35px,2.8vw,55px)] xl:top-[clamp(80px,6vw,110px)] xl:w-[clamp(180px,15vw,280px)]"
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
            <linearGradient id="supportQrArrowRainbow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EE334E" />
              <stop offset="33%" stopColor="#FCB131" />
              <stop offset="67%" stopColor="#00A651" />
              <stop offset="100%" stopColor="#0081C8" />
            </linearGradient>
          </defs>

          <path
            d="M 10,110 C 60,95 90,85 120,80 C 135,78 155,62 148,40 C 138,15 122,30 138,55 C 150,80 185,82 215,70 C 235,62 255,52 275,42"
            stroke="url(#supportQrArrowRainbow)"
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
