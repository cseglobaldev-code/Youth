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
      width={858}
      destroyOnHidden
      closable={false}
      rootClassName="leader-modal"
      styles={{
        body: { padding: 0 },
        mask: { backgroundColor: 'rgba(0,0,0,0.6)' },
      }}
    >
      {/* ── HEADER 320px: rainbow gradient 50% + wave 10% + close btn + photo + text ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: 320, borderRadius: '20px 20px 0 0', backgroundColor: '#fff' }}
      >
        {/* Layer 1: rainbow gradient at 50% opacity (Figma: Rectangle 3829) */}
        <div className="absolute inset-0" style={{ background: RAINBOW, opacity: 0.5 }} />

        {/* Layer 2: wave vector SVG at 10% opacity */}
        <img
          src="/images/leadership/modal-bg-wave.svg"
          alt=""
          aria-hidden="true"
          className="absolute pointer-events-none select-none"
          style={{ left: 0, top: 12, width: 1525.65, height: 383, opacity: 0.10 }}
        />

        {/* Close button — white X, no border */}
        <button
          type="button"
          onClick={onClose}
          className="absolute flex items-center justify-center rounded-full transition-colors hover:bg-white/20 active:bg-white/30"
          style={{ right: 16, top: 16, width: 32, height: 32, zIndex: 20 }}
          aria-label="Close"
        >
          <Icon name={ICONS.close} size={16} color="#FFFFFF" />
        </button>

        {/* Profile photo — 268×268 circle at Figma exact position */}
        <div
          className="absolute overflow-hidden rounded-full"
          style={{
            left: 504,
            top: 31.87,
            width: 268,
            height: 268,
            zIndex: 10,
          }}
        >
          {member.avatarUrl && (
            <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
          )}
        </div>

        {/* Text info block — column at Figma x:28, y:179 */}
        <div
          className="absolute flex flex-col"
          style={{ left: 28, top: 179, gap: 4, maxWidth: 450, zIndex: 10 }}
        >
          {/* Name + all social icons (dynamic — same set as card hover) */}
          <div className="flex items-center flex-wrap" style={{ gap: 4 }}>
            <span style={{
              fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 24,
              lineHeight: '120%', letterSpacing: '-0.0104em', color: '#1A1919',
            }}>
              {member.name}
            </span>
            {member.socialLinks?.map(link => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.platform}
                className="flex items-center justify-center bg-white rounded-[20px] hover:scale-110 transition-transform flex-shrink-0"
                style={{ width: 24, height: 24, padding: 4 }}
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
          <span style={{
            fontFamily: 'Be Vietnam Pro, Be Vietnam, sans-serif', fontWeight: 400,
            fontSize: 16, lineHeight: '150%', color: '#FFFFFF',
          }}>
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
            <span style={{
              fontFamily: 'Be Vietnam Pro, Be Vietnam, sans-serif', fontWeight: 400,
              fontSize: 16, lineHeight: '150%', color: '#000000',
            }}>
              {member.year}
            </span>
          )}
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
