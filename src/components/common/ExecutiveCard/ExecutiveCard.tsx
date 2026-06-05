import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';
import { ICONS } from '@/config/icons';
import type { TeamMember } from '@/types';

export interface ExecutiveCardProps {
  member: TeamMember;
  className?: string;
}

export function ExecutiveCard({ member, className }: ExecutiveCardProps) {
  return (
    <div className={cn('flex flex-col gap-5', className)}>
      {/*
        Avatar 240×240 — hover: dark overlay rgba(0,0,0,0.3) + 3 social icons appear.
        Figma Frame 125: position x:52, y:166.65, row, gap:8px, width:136px.
        Social icon buttons: 40×40, white, borderRadius:20px, icon 24×24.
      */}
      <div className="relative w-[240px] h-[240px] flex-shrink-0 group cursor-pointer">
        {/* Photo */}
        <div className="w-full h-full rounded-full overflow-hidden bg-[#EEEEEE]">
          {member.avatarUrl && (
            <img
              src={member.avatarUrl}
              alt={member.name}
              className="w-full h-full object-cover object-top"
            />
          )}
        </div>

        {/* Dark overlay — hidden by default, fades in on hover */}
        <div
          className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
        />

        {/* Social icons row — hidden by default, appears on hover */}
        {member.socialLinks && member.socialLinks.length > 0 && (
          <div
            className="absolute flex flex-row gap-[8px] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0"
            style={{
              /* Figma: x:52, y:166.65 within 240×240 frame */
              left: '52px',
              top: '166.65px',
              width: '136px',
            }}
          >
            {member.socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.platform}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 h-[40px] bg-white rounded-[20px] flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Icon name={ICONS[link.platform]} size={24} className="text-black" />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Name + Role — column, center, gap:4px */}
      <div className="flex flex-col gap-[4px] text-center">
        <span
          className="font-semibold text-black"
          style={{ fontSize: '20px', lineHeight: '140%', fontFamily: 'Open Sans, sans-serif' }}
        >
          {member.name}
        </span>
        <span
          className="text-black"
          style={{ fontSize: '18px', lineHeight: '140%', fontFamily: 'Inter, sans-serif', opacity: 0.7 }}
        >
          {member.role}
        </span>
      </div>
    </div>
  );
}
