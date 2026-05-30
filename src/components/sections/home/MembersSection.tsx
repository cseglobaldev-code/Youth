import { Container } from '@/components/ui/Container';
import { MemberCard } from '@/components/common/MemberCard';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/routes/paths';
import type { Member } from '@/types';

interface MembersSectionProps {
  members: Member[];
}

export function MembersSection({ members }: MembersSectionProps) {
  return (
    <section className="py-16 lg:py-24 bg-neutral-50 relative overflow-hidden">
      {/* Decorative ellipses matching Figma */}
      <div className="absolute top-0 right-0 w-[1468px] h-[265px] rounded-full bg-brand-50/30 blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[368px] h-[149px] rounded-full bg-accent/10 blur-2xl pointer-events-none" />

      <Container>
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-neutral-900">
            <span className="text-brand">Our</span> Members
          </h2>
        </div>

        {/* Grid 3 cols × 2 rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.slice(0, 6).map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>

        {/* naviSlide / pagination dots */}
        <div className="flex justify-center mt-8 gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`rounded-full transition-all ${
                i === 0 ? 'w-8 h-2 bg-brand' : 'w-2 h-2 bg-neutral-300'
              }`}
            />
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button as="router-link" to={ROUTES.MEMBERS} variant="outline">
            View All Members
          </Button>
        </div>
      </Container>
    </section>
  );
}
