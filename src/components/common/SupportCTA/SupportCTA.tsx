import supportCtaArrowUrl from './support-cta-arrow.svg';

type SupportCTAButtonProps = {
  /** Click handler — use this for modal-trigger CTA usage. */
  onClick: () => void;
  href?: never;
  title?: string;
  /** Optional accessibility text for the CTA. */
  description?: string;
  className?: string;
};

type SupportCTALinkProps = {
  /** Where the button links when used as an external CTA. */
  href: string;
  onClick?: never;
  title?: string;
  /** Optional accessibility text for the CTA. */
  description?: string;
  className?: string;
};

export type SupportCTAProps = SupportCTAButtonProps | SupportCTALinkProps;

export function SupportCTA({
  href,
  onClick,
  title = 'Support our Mission',
  description = 'Send your spiritual or financial support to this organization',
  className,
}: SupportCTAProps) {
  const buttonClasses =
    'inline-flex h-[50px] min-w-[220px] items-center justify-center rounded-full border border-[#EE334E] bg-transparent px-8 text-[16px] font-normal leading-none text-[#EE334E] transition-colors duration-200 hover:bg-[#EE334E] hover:text-white active:scale-[0.99] whitespace-nowrap sm:h-[58px] sm:min-w-[270px] sm:px-10 sm:text-[18px] lg:h-[64px] lg:min-w-[300px] lg:text-[20px]';

  const buttonContent = <span style={{ fontFamily: 'Open Sans, sans-serif' }}>{title}</span>;

  return (
    <div
      className={['relative flex-shrink-0 pb-[54px]', className].filter(Boolean).join(' ')}
    >
      <div className="flex items-center justify-end gap-[18px]">
        <span
          className="block max-w-[280px] text-right text-black"
          style={{
            fontFamily: 'Open Sans, sans-serif',
            fontSize: '18px',
            fontStyle: 'italic',
            fontWeight: 400,
            lineHeight: '150%',
            letterSpacing: '0px',
          }}
        >
          {description}
        </span>

        {onClick ? (
          <button
            type="button"
            onClick={onClick}
            className={buttonClasses}
          >
            {buttonContent}
          </button>
        ) : (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses}
          >
            {buttonContent}
          </a>
        )}
      </div>

      {/* Decorative arrow under the caption, pointing up to the CTA button. */}
      <div className="absolute pointer-events-none left-[116px] top-[70px] h-[51px] w-[270.188px] opacity-100">
        <img
          src={supportCtaArrowUrl}
          alt=""
          aria-hidden="true"
          className="block h-full w-full"
        />
      </div>
    </div>
  );
}
