import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';
import { ICONS } from '@/config/icons';
import type { TeamMember } from '@/types';

export interface TeamMemberCardProps {
  member: TeamMember;
  avatarSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  className?: string;
}

const sizeMap: Record<string, number> = {
  sm: 32, md: 40, lg: 56, xl: 80, '2xl': 120, '3xl': 160, '4xl': 180,
};

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

export function TeamMemberCard({ member, avatarSize = 'xl', className }: TeamMemberCardProps) {
  const px = sizeMap[avatarSize] ?? 80;
  const hasSocial = member.socialLinks && member.socialLinks.length > 0;

  // Icon row: 3 icons × 40px + 2 × 8px gap = 136px wide
  // Centered: left = (px - 136) / 2 (may be negative for small avatars → use 50% + transform)
  // Bottom: same proportion as exec card (33px in 240px) → scaled
  const iconBottom = Math.round(33 * (px / 240));

  return (
    <div className={cn('flex flex-col items-center text-center p-4', className)}>
      {/* ── Circular avatar with hover overlay + social icons ── */}
      <div
        className="relative flex-shrink-0 group cursor-pointer mx-auto"
        style={{ width: Math.min(px, 180), height: Math.min(px, 180), maxWidth: '100%' }}
      >
        {/* Photo */}
        <div className="w-full h-full rounded-full overflow-hidden bg-[#EEEEEE]">
          {member.avatarUrl ? (
            <img
              src={member.avatarUrl}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-semibold text-neutral-600">
              {getInitials(member.name)}
            </div>
          )}
        </div>

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" />

        {/* Social icons — appear at bottom on hover */}
        {hasSocial && px >= 120 && (
          <div
            className="absolute"
            style={{ bottom: iconBottom, left: '50%', transform: 'translateX(-50%)' }}
          >
            <div className="flex flex-row gap-[8px] opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
              {member.socialLinks!.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.platform}
                  onClick={(e) => e.stopPropagation()}
                  className="w-[40px] h-[40px] bg-white rounded-[20px] flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Icon name={ICONS[link.platform]} size={24} className="text-black" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Name */}
      <h3
        className="mt-3 font-semibold text-black"
        style={{ fontSize: '20px', lineHeight: '140%', fontFamily: 'Open Sans, sans-serif' }}
      >
        {member.name}
      </h3>

      {/* Role */}
      <p
        className="text-black mt-0.5"
        style={{ fontSize: '18px', lineHeight: '140%', fontFamily: 'Inter, sans-serif', opacity: 0.7 }}
      >
        {member.role}
      </p>
    </div>
  );
}
