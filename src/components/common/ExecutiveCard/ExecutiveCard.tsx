import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';
import { ICONS, SOCIAL_COLORS } from '@/config/icons';
import type { TeamMember } from '@/types';

export interface ExecutiveCardProps {
  member: TeamMember;
  className?: string;
  onClick?: () => void;
}

export function ExecutiveCard({ member, className, onClick }: ExecutiveCardProps) {
  const hasSocial = member.socialLinks && member.socialLinks.length > 0;

  return (
    <div className={cn('flex flex-col gap-5', className)} onClick={onClick}>
      {/*
        Avatar 240×240 — hover darkens the photo (brightness-50) and fades in
        brand-colored social icons from the bottom. Matches the homepage
        TeamSection so hover is consistent across the app.
      */}
      <div className="relative w-[150px] h-[150px] sm:w-[190px] sm:h-[190px] lg:w-[240px] lg:h-[240px] flex-shrink-0 group cursor-pointer mx-auto">
        {/* Photo */}
        <div className="w-full h-full rounded-full overflow-hidden bg-[#EEEEEE]">
          {member.avatarUrl && (
            <img
              src={member.avatarUrl}
              alt={member.name}
              className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-50"
            />
          )}
        </div>

        {/* Social icons row — hidden by default, appears at bottom on hover */}
        {hasSocial && (
          <div className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex gap-3">
              {member.socialLinks!.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.platform}
                  onClick={(e) => e.stopPropagation()}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Icon name={ICONS[link.platform]} size={16} color={SOCIAL_COLORS[link.platform]} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Name + Role — column, center, gap:4px */}
      <div className="flex flex-col gap-[4px] text-center">
        <span
          className="font-semibold text-black text-base sm:text-lg lg:text-[20px]"
          style={{ lineHeight: '140%', fontFamily: 'Open Sans, sans-serif' }}
        >
          {member.name}
        </span>
        <span
          className="text-black text-sm sm:text-base lg:text-[18px]"
          style={{ lineHeight: '140%', fontFamily: 'Inter, sans-serif', opacity: 0.7 }}
        >
          {member.role}
        </span>
      </div>
    </div>
  );
}
