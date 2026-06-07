import { useParams } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { SDGTag } from '@/components/ui/SDGTag';
import { SocialLinks } from '@/components/common/SocialLinks';
import { ProjectCard } from '@/components/common/ProjectCard';
import { ImageGallery } from '@/components/common/ImageGallery';
import { SupportQRCode } from '@/components/common/SupportQRCode';
import { CTABanner } from '@/components/common/CTABanner';
import { SectionHeading } from '@/components/common/SectionHeading';
import { MEMBERS_DATA, PROJECTS_DATA } from '@/data';

export function MemberDetailPage() {
  const { memberId } = useParams<{ memberId: string }>();
  const member = MEMBERS_DATA.find((m) => m.id === memberId);

  if (!member) {
    return (
      <Container className="py-section text-center">
        <h2 className="text-h2 font-bold text-neutral-900">Member Not Found</h2>
        <p className="mt-2 text-neutral-600">The organization you're looking for doesn't exist.</p>
      </Container>
    );
  }

  const memberProjects = PROJECTS_DATA.filter((p) => member.projectIds.includes(p.id));
  const relatedProjects = [
    ...memberProjects,
    ...PROJECTS_DATA.filter((p) => !member.projectIds.includes(p.id)),
  ].slice(0, 3);
  const supportValue = member.donationQrUrl ?? member.socialLinks[0]?.url ?? `https://youthorgunion.org/members/${member.id}`;

  return (
    <div className="py-section-sm lg:py-section">
      <Container>
        <div className="mb-14">
          <div className="mb-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <h1
                className="font-semibold text-black"
                style={{
                  fontFamily: 'Open Sans, sans-serif',
                  fontSize: 'clamp(2.5rem, 4.17vw, 5rem)',
                  lineHeight: '110%',
                }}
              >
                {member.name}
              </h1>
              <p
                className="mt-5 text-[#151515]"
                style={{
                  fontFamily: 'Open Sans, sans-serif',
                  fontSize: 'clamp(1rem, 1.25vw, 1.5rem)',
                  lineHeight: '140%',
                }}
              >
                {member.country} &nbsp;·&nbsp; {member.shortDescription.split(' ').slice(0, 3).join(' ')} &nbsp;·&nbsp; Member since:{' '}
                {member.period?.split(' ')[0] ?? '2021'}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {member.focusSdgs.map((sdgId) => (
                  <SDGTag
                    key={sdgId}
                    sdgId={sdgId}
                    variant="solid"
                    size="md"
                    className="!rounded-[6px]"
                  />
                ))}
              </div>
            </div>

            <SupportQRCode value={supportValue} />
          </div>

          {member.coverUrl && (
            <div className="overflow-hidden rounded-[40px] bg-[#EAF3FA]" style={{ height: 'clamp(240px, 32.7vw, 628px)' }}>
              <img src={member.coverUrl} alt={member.name} className="h-full w-full object-cover" />
            </div>
          )}
        </div>

        <div className="mb-14 grid gap-10 lg:grid-cols-2 lg:gap-24">
          <div>
            <h2
              className="mb-6 font-semibold text-black"
              style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 'clamp(1.5rem, 2.29vw, 2.75rem)', lineHeight: '140%' }}
            >
              About Organization
            </h2>
            <p className="leading-relaxed text-neutral-700">{member.description}</p>
            {member.socialLinks.length > 0 && <SocialLinks links={member.socialLinks} className="mt-4" />}
          </div>

          <div>
            <h2
              className="mb-6 font-semibold text-black"
              style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 'clamp(1.5rem, 2.29vw, 2.75rem)', lineHeight: '140%' }}
            >
              Representative
            </h2>
            <p className="leading-relaxed text-neutral-700">{member.leader ?? 'TBD'}</p>
          </div>
        </div>

        {relatedProjects.length > 0 && (
          <div className="mb-10">
            <SectionHeading title="Our Projects" align="left" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {member.gallery.length > 0 && (
          <div className="mb-10">
            <SectionHeading title="Activities" align="left" />
            <ImageGallery images={member.gallery} maxVisible={7} variant="featured" />
          </div>
        )}
      </Container>

      <CTABanner
        title="Ready to Make an Impact?"
        description="Join thousands of youth leaders across ASEAN who are making a difference in their communities."
        ctaLabel="Register Now"
      />
    </div>
  );
}
