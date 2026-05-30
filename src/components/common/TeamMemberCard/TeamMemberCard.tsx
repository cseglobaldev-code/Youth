import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { SocialLinks } from '@/components/common/SocialLinks';
import type { TeamMember } from '@/types';

export interface TeamMemberCardProps {
  member: TeamMember;
  className?: string;
}

export function TeamMemberCard({ member, className }: TeamMemberCardProps) {
  return (
    <div className={cn('flex flex-col items-center text-center p-4', className)}>
      <Avatar src={member.avatarUrl} alt={member.name} size="xl" />
      <h3 className="mt-3 font-semibold text-neutral-900 text-sm">{member.name}</h3>
      <p className="text-xs text-neutral-500 mt-0.5">{member.role}</p>
      {member.socialLinks && member.socialLinks.length > 0 && (
        <SocialLinks links={member.socialLinks} size={16} className="mt-2" />
      )}
    </div>
  );
}
