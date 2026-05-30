import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { TeamMemberCard } from '@/components/common/TeamMemberCard';
import { TEAM_DATA } from '@/data';

export function LeadershipPage() {
  // Group by continent
  const grouped = TEAM_DATA.reduce(
    (acc, member) => {
      const key = member.continent;
      if (!acc[key]) acc[key] = [];
      acc[key].push(member);
      return acc;
    },
    {} as Record<string, typeof TEAM_DATA>
  );

  return (
    <div className="py-section-sm lg:py-section">
      <Container>
        <SectionHeading
          eyebrow="Our Leaders"
          title="Leadership Team"
          description="Meet the dedicated leaders guiding Y.O.U's mission across continents."
        />
        {Object.entries(grouped).map(([continent, members]) => (
          <div key={continent} className="mb-10">
            <h3 className="font-heading font-semibold text-h3 text-neutral-800 mb-4">{continent}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {members.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        ))}
      </Container>
    </div>
  );
}
