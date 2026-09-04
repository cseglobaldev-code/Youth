import { TeamMemberCard } from '@/components/leadership/TeamMemberCard';
import { ExecutiveCard } from '@/components/leadership/ExecutiveCard';
import type { TeamGridBlockData } from '@/types';

export function TeamGridBlock({ data }: { data: TeamGridBlockData }) {
  const teamMembers = data.teamMembers || [];

  return (
    <div>
      <div className="text-center mb-10">
        {data.termLabel && <span className="text-sm font-semibold text-[#EE334E] uppercase">{data.termLabel}</span>}
        <h2 className="font-semibold text-2xl md:text-4xl text-neutral-900 mt-1" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          {data.title}
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-8">
        {teamMembers.map((member) => (
          <div key={member.id} className="w-[240px]">
            {data.leadershipType === 'executive' ? (
              <ExecutiveCard member={member} />
            ) : (
              <TeamMemberCard member={member} avatarSize="3xl" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}