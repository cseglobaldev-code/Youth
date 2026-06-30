import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';
import { ICONS, SOCIAL_COLORS } from '@/config/icons';
import type { TeamMember } from '@/types';

export interface TeamMemberCardProps {
  member: TeamMember;
  avatarSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  className?: string;
  onClick?: () => void;
}

const sizeMap: Record<string, number> = {
  sm: 32, md: 40, lg: 56, xl: 80, '2xl': 120, '3xl': 160, '4xl': 180,
};

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

export function TeamMemberCard({ member, avatarSize = 'xl', className, onClick }: TeamMemberCardProps) {
  const px = Math.min(sizeMap[avatarSize] ?? 80, 180);
  const hasSocial = member.socialLinks && member.socialLinks.length > 0;

  return (
    <div className={cn('flex flex-col items-center text-center p-4', onClick && 'cursor-pointer', className)} onClick={onClick}>
      {/*
        Circular avatar — hover darkens the photo (brightness-50) and fades in
        brand-colored social icons from the bottom. Matches the homepage
        TeamSection so hover is consistent across the app.
      */}
      <div
        className="relative flex-shrink-0 group cursor-pointer mx-auto aspect-square"
        style={{ width: `min(${px}px, 38vw)` }}
      >
        {/* Photo */}
        <div className="w-full h-full rounded-full overflow-hidden bg-[#EEEEEE]">
          {member.avatarUrl ? (
            <img
              src={member.avatarUrl}
              alt={member.name}
              className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-50"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-semibold text-neutral-600">
              {getInitials(member.name)}
            </div>
          )}
        </div>

        {/* Social icons — appear at bottom on hover (only for larger avatars) */}
        {hasSocial && px >= 120 && (
          <div className="absolute inset-0 flex items-end justify-center pb-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex gap-2">
              {member.socialLinks!.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.platform}
                  onClick={(e) => e.stopPropagation()}
                  className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Icon name={ICONS[link.platform]} size={14} color={SOCIAL_COLORS[link.platform]} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Name */}
      <h3
        className="mt-3 font-semibold text-black text-[clamp(1rem,1.2vw,1.25rem)]"
        style={{ lineHeight: '140%', fontFamily: 'Open Sans, sans-serif' }}
      >
        {member.name}
      </h3>

      {/* Role */}
      <p
        className="text-black mt-0.5 text-sm sm:text-base lg:text-[18px]"
        style={{ lineHeight: '140%', fontFamily: 'Inter, sans-serif', opacity: 0.7 }}
      >
        {member.role}
      </p>
    </div>
  );
}
