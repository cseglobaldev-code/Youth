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
    <div className={['flex-shrink-0 relative pb-0 xl:pb-[100px]', className].filter(Boolean).join(' ')} style={{ minWidth: 0 }}>
      <div className="flex items-center gap-[18px]">
        <div
          style={{
            width: 'clamp(160px, 16vw, 307px)',
            textAlign: 'right',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              display: 'block',
              fontFamily: 'Open Sans, sans-serif',
              fontWeight: 600,
              fontStyle: 'italic',
              fontSize: 'clamp(0.875rem, 1.04vw, 1.25rem)',
              lineHeight: '150%',
              color: '#000000',
            }}
          >
            {title}
          </span>
          <span
            style={{
              display: 'block',
              fontFamily: 'Open Sans, sans-serif',
              fontWeight: 400,
              fontStyle: 'italic',
              fontSize: 'clamp(0.75rem, 0.94vw, 1.125rem)',
              lineHeight: '150%',
              color: '#000000',
            }}
          >
            {description}
          </span>
        </div>

        <div
          style={{
            transform: 'rotate(15deg)',
            transformOrigin: 'center',
            flexShrink: 0,
          }}
        >
          <div className="animate-float-y">
            <div
              style={{
                width: 'clamp(120px, 8.75vw, 168px)',
                height: 'clamp(120px, 8.75vw, 168px)',
                background: QR_CONIC,
                borderRadius: '16px',
                padding: '8px',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#ffffff',
                  borderRadius: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <QRCodeSVG value={value} size={100} bgColor="#ffffff" fgColor="#000000" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="hidden xl:block absolute pointer-events-none"
        style={{
          top: 'clamp(80px, 6vw, 110px)',
          left: 'clamp(35px, 2.8vw, 55px)',
          width: 'clamp(180px, 15vw, 280px)',
        }}
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
