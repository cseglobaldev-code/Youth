import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Skeleton } from 'antd';
import { Container } from '@/components/ui/Container';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { SDGTag } from '@/components/ui/SDGTag';
import { SocialLinks } from '@/components/shared/SocialLinks';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ImageGallery } from '@/components/shared/ImageGallery';
import { SupportCTA } from '@/components/shared/SupportCTA';
import { CTABanner } from '@/components/shared/CTABanner';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { useSupportModal } from '@/components/modals/SupportModal';
import { fetchMemberById, type MemberDetailItem } from '@/api/members';
import { cn, countryFlagEmoji, formatJoinDate } from '@/lib/utils';

export function MemberDetailPage() {
  const { memberId } = useParams<{ memberId: string }>();
  const { openSupport } = useSupportModal();
  const [member, setMember] = useState<MemberDetailItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!memberId) return;
    const controller = new AbortController();

    setLoading(true);
    fetchMemberById(memberId, { signal: controller.signal })
      .then(setMember)
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
        console.error('Failed to load member from CMS', requestError);
        setMember(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [memberId]);

  if (loading) {
    return (
      <Container className="py-section">
        <Skeleton active paragraph={{ rows: 6 }} />
      </Container>
    );
  }

  if (!member) {
    return (
      <Container className="py-section text-center">
        <h2 className="text-h2 font-bold text-neutral-900">Member Not Found</h2>
        <p className="mt-2 text-neutral-600">The organization you're looking for doesn't exist.</p>
      </Container>
    );
  }

  const relatedProjects = member.projects.slice(0, 3);
  const hasRepresentative = Boolean(
    member.leader || member.leaderRole || member.leaderEmail || member.leaderPhone
  );

  return (
    <div className="py-section-sm lg:py-section">
      <Container>
        <div className="mb-14">
          <div className="mb-10 flex flex-col md:flex-row md:items-start md:justify-between gap-4 lg:gap-8">
            <div className="min-w-0 flex-1">
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
                className="mt-5 text-[#151515] whitespace-nowrap overflow-x-auto"
                style={{
                  fontFamily: 'Open Sans, sans-serif',
                  fontSize: 'clamp(0.75rem, 1.9vw, 1rem)',
                  lineHeight: '140%',
                }}
              >
                Originated in {countryFlagEmoji(member.country)} {member.country} &nbsp;·&nbsp; Since{' '}
                {member.period?.split(' ')[0] ?? '2021'} &nbsp;·&nbsp; Join Union from:{' '}
                {formatJoinDate(member.createdAt) ?? '—'}
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

            <SupportCTA onClick={openSupport} />
          </div>

          <div className="overflow-hidden rounded-[40px] bg-[#EAF3FA]" style={{ height: 'clamp(240px, 32.7vw, 628px)' }}>
            <ImageWithFallback src={member.coverUrl} alt={member.name} className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="mb-14 grid gap-10 lg:grid-cols-2 lg:gap-24">
          <div className={cn(!hasRepresentative && 'lg:col-span-2')}>
            <h2
              className="mb-6 font-semibold text-black"
              style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 'clamp(1.5rem, 2.29vw, 2.75rem)', lineHeight: '140%' }}
            >
              About Organization
            </h2>
            <p className="leading-relaxed text-neutral-700">{member.description}</p>
            {member.socialLinks.length > 0 && (
              <div className="mt-4 flex items-center gap-3">
                <span className="font-semibold text-black">Follow us</span>
                <SocialLinks links={member.socialLinks} />
              </div>
            )}
          </div>

          {hasRepresentative && (
            <div>
              <h2
                className="mb-6 font-semibold text-black"
                style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 'clamp(1.5rem, 2.29vw, 2.75rem)', lineHeight: '140%' }}
              >
                Representative
              </h2>
              <div className="flex flex-col gap-2 leading-relaxed text-neutral-700">
                {member.leader && <p className="font-semibold text-black">{member.leader}</p>}
                {member.leaderRole && <p>{member.leaderRole}</p>}
                {member.leaderEmail && (
                  <p>
                    <a href={`mailto:${member.leaderEmail}`} className="text-[#005D9A] hover:underline">
                      {member.leaderEmail}
                    </a>
                  </p>
                )}
                {member.leaderPhone && (
                  <p>
                    <a href={`tel:${member.leaderPhone}`} className="text-[#005D9A] hover:underline">
                      {member.leaderPhone}
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}
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
