import { useNavigate } from 'react-router-dom';
import { MemberCardLarge } from '@/components/members/MemberCardLarge';
import { ViewAllButton } from '@/components/shared/ViewAllButton';
import { ROUTES } from '@/routes/paths';
import type { FeaturedMembersBlockData } from '@/types';

export function FeaturedMembersBlock({ data }: { data: FeaturedMembersBlockData }) {
  const navigate = useNavigate();
  const members = (data.members || []).slice(0, data.limit || 6);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-semibold text-2xl md:text-4xl text-neutral-900" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            {data.title}
          </h2>
          {data.subtitle && <p className="mt-2 text-neutral-600">{data.subtitle}</p>}
        </div>
        {data.showViewAll && <ViewAllButton to={ROUTES.MEMBERS} />}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {members.map((member) => (
          <MemberCardLarge
            key={member.id}
            member={{
              name: member.name,
              country: member.country,
              period: member.period || '2020 → nay',
              leader: member.leader || 'TBD',
              focusSdgs: member.focusSdgs,
              coverUrl: member.coverUrl || '',
              logoUrl: member.logoUrl,
            }}
            onClick={() => navigate(ROUTES.MEMBER_DETAIL(member.id))}
          />
        ))}
      </div>
    </div>
  );
}