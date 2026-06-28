import { Modal } from 'antd';
import { Icon } from '@/components/ui/Icon';
import { SDGTag } from '@/components/ui/SDGTag';
import { ICONS, SOCIAL_COLORS } from '@/config/icons';
import type { TeamMember } from '@/types';

interface LeaderMemberModalProps {
  member: TeamMember | null;
  open: boolean;
  onClose: () => void;
}

const RAINBOW = 'linear-gradient(90deg, rgba(238,51,78,1) 0%, rgba(252,177,49,1) 33%, rgba(0,166,81,1) 67%, rgba(0,129,200,1) 100%)';

export function LeaderMemberModal({ member, open, onClose }: LeaderMemberModalProps) {
  if (!member) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width="min(858px, calc(100vw - 32px))"
      destroyOnHidden
      closable={false}
      rootClassName="leader-modal"
      styles={{
        body: { padding: 0 },
        mask: { backgroundColor: 'rgba(0,0,0,0.6)' },
      }}
    >
      {/* ── HEADER: responsive gradient + wave + photo + text ── */}
      <div className="relative overflow-hidden rounded-t-[20px] bg-white px-5 py-8 sm:px-7 sm:py-9">
        {/* Layer 1: rainbow gradient at 50% opacity (Figma: Rectangle 3829) */}
        <div className="absolute inset-0" style={{ background: RAINBOW, opacity: 0.5 }} />

        {/* Layer 2: wave vector SVG at 10% opacity */}
        <img
          src="/images/leadership/modal-bg-wave.svg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-10 pointer-events-none select-none"
        />

        {/* Close button — white X, no border */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/20 active:bg-white/30"
          aria-label="Close"
        >
          <Icon name={ICONS.close} size={16} color="#FFFFFF" />
        </button>

        <div className="relative z-10 grid items-end gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(180px,268px)]">
          {/* Text info block */}
          <div className="order-2 flex min-w-0 flex-col gap-1 sm:order-1">
            {/* Name + all social icons (dynamic — same set as card hover) */}
            <div className="flex flex-wrap items-center gap-1">
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
                  lineHeight: '120%',
                  color: '#1A1919',
                }}
              >
                {member.name}
              </span>
              {member.socialLinks?.map(link => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.platform}
                  className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-[20px] bg-white p-1 transition-transform hover:scale-110"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Icon
                    name={ICONS[link.platform as keyof typeof ICONS]}
                    size={12}
                    color={SOCIAL_COLORS[link.platform as keyof typeof SOCIAL_COLORS]}
                  />
                </a>
              ))}
            </div>

            {/* Role — white */}
            <span
              style={{
                fontFamily: 'Be Vietnam Pro, Be Vietnam, sans-serif',
                fontWeight: 400,
                fontSize: 16,
                lineHeight: '150%',
                color: '#FFFFFF',
              }}
            >
              {member.role}
            </span>

            {/* SDG tags — colored pill badges */}
            {member.sdgTags && member.sdgTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {member.sdgTags.map(tag => (
                  <SDGTag key={tag} sdgId={Number(tag.replace('SDG', ''))} variant="solid" size="md" />
                ))}
              </div>
            )}

            {/* Year — black */}
            {member.year && (
              <span
                style={{
                  fontFamily: 'Be Vietnam Pro, Be Vietnam, sans-serif',
                  fontWeight: 400,
                  fontSize: 16,
                  lineHeight: '150%',
                  color: '#000000',
                }}
              >
                {member.year}
              </span>
            )}
          </div>

          {/* Profile photo */}
          <div className="order-1 mx-auto aspect-square w-[min(58vw,268px)] overflow-hidden rounded-full sm:order-2 sm:w-full">
            {member.avatarUrl && (
              <img src={member.avatarUrl} alt={member.name} className="h-full w-full object-cover" />
            )}
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div
        className="flex flex-col bg-white"
        style={{ gap: 20, padding: '32px 28px', maxHeight: '55vh', overflowY: 'auto' }}
      >
        {member.bio && member.bio.length > 0 && (
          <div className="flex flex-col" style={{ gap: 20 }}>
            {member.bio.map((para, i) => (
              <p
                key={i}
                style={{
                  fontFamily: 'Inter, sans-serif', fontWeight: 300, fontSize: 18,
                  lineHeight: '150%', color: '#1A1919', margin: 0,
                }}
              >
                {para}
              </p>
            ))}
          </div>
        )}

      </div>
    </Modal>
  );
}
