import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Card } from '@/components/common/Card';
import { SDGTag } from '@/components/ui/SDGTag';
import { ROUTES } from '@/routes/paths';
import type { Member } from '@/types';

export interface MemberCardProps {
  member: Member;
  className?: string;
}

export function MemberCard({ member, className }: MemberCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      hoverable
      padding="none"
      className={cn('flex flex-col', className)}
      onClick={() => navigate(ROUTES.MEMBER_DETAIL(member.id))}
    >
      <div className="h-40 bg-neutral-100 overflow-hidden">
        <img
          src={member.coverUrl || member.logoUrl}
          alt={member.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-2">
          <img
            src={member.logoUrl}
            alt={`${member.name} logo`}
            className="w-10 h-10 rounded-full object-cover border border-neutral-200"
          />
          <h3 className="font-semibold text-neutral-900 text-sm line-clamp-2">{member.name}</h3>
        </div>
        <p className="text-xs text-neutral-600 line-clamp-2 mb-3 flex-1">
          {member.shortDescription}
        </p>
        <div className="flex flex-wrap gap-1">
          {member.focusSdgs.slice(0, 3).map((sdgId) => (
            <SDGTag key={sdgId} sdgId={sdgId} size="sm" variant="soft" />
          ))}
          {member.focusSdgs.length > 3 && (
            <span className="text-xs text-neutral-400">+{member.focusSdgs.length - 3}</span>
          )}
        </div>
      </div>
    </Card>
  );
}
