import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/routes/paths';
import type { TeamMember } from '@/types';

interface TeamSectionProps {
  members: TeamMember[];
}

function LeaderCard({ member, size = 'lg' }: { member: TeamMember; size?: 'lg' | 'sm' }) {
  const imgSize = size === 'lg' ? 'w-[240px] h-[240px]' : 'w-[180px] h-[180px]';
  return (
    <div className="flex flex-col items-center text-center">
      <div className={`${imgSize} rounded-2xl overflow-hidden bg-neutral-100 mb-4`}>
        <img
          src={member.avatarUrl}
          alt={member.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <h4 className={`font-semibold text-neutral-900 ${size === 'lg' ? 'text-lg' : 'text-base'}`}>
        {member.name}
      </h4>
      <p className="text-neutral-500 text-sm mt-0.5">{member.role}</p>
    </div>
  );
}

export function TeamSection({ members }: TeamSectionProps) {
  const leaders = members.slice(0, 3);
  const directors = members.slice(3, 8);

  return (
    <section className="py-16 lg:py-24 bg-white">
      <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-neutral-900">
            Our <span className="text-brand">Leadership</span>
          </h2>
        </div>

        {/* Main leaders — 3 centered */}
        <div className="mb-6">
          <p className="text-center text-neutral-500 text-sm mb-8">2020 - 2026</p>
          <div className="flex justify-center gap-8 flex-wrap">
            {leaders.map((m) => (
              <LeaderCard key={m.id} member={m} size="lg" />
            ))}
          </div>
        </div>

        <hr className="border-neutral-200 my-10" />

        {/* Continental Directors */}
        <div>
          <h3 className="text-center font-semibold text-neutral-900 text-xl mb-8">
            Continental Directors
          </h3>
          <div className="flex justify-center gap-6 flex-wrap">
            {directors.map((m) => (
              <LeaderCard key={m.id} member={m} size="sm" />
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Button as="router-link" to={ROUTES.LEADERSHIP} variant="outline">
            View all
          </Button>
        </div>
      </Container>
    </section>
  );
}
