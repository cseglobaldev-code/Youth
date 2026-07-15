// src/pages/MemberDetailPage/MemberDetailPage.tsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { Container } from '@/components/ui/Container';
import { SDGTag } from '@/components/ui/SDGTag';
import { SocialLinks } from '@/components/common/SocialLinks';
import { ProjectCard } from '@/components/common/ProjectCard';
import { ImageGallery } from '@/components/common/ImageGallery';
import { SupportCTA } from '@/components/common/SupportCTA';
import { CTABanner } from '@/components/common/CTABanner';
import { SectionHeading } from '@/components/common/SectionHeading';
import { StrapiService } from '@/lib/strapi';
import { useJoinNavigation } from '@/hooks';
import { useSupportModal } from '@/components/common/SupportModal';
import { MEMBERS_DATA, PROJECTS_DATA } from '@/data';
import type { Member, Project } from '@/types';

export function MemberDetailPage() {
  const { memberId } = useParams<{ memberId: string }>();
  const goToJoin = useJoinNavigation();
  const { openSupport } = useSupportModal();

  const [member, setMember] = useState<Member | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!memberId) return;

    Promise.all([
      StrapiService.getMemberById(memberId),
      StrapiService.getProjects()
    ])
      .then(([memberData, allProjects]) => {
        setMember(memberData);
        const memberProjects = allProjects.filter((p) => p.memberId === memberId);
        setProjects(memberProjects.length > 0 ? memberProjects : allProjects.slice(0, 3));
        setLoading(false);
      })
      .catch((err) => {
        console.error('API failed, falling back to static members_data:', err);
        const fallbackMember = MEMBERS_DATA.find((m) => m.id === memberId);
        if (fallbackMember) {
          setMember(fallbackMember);
          const fallbackProjects = PROJECTS_DATA.filter((p) => fallbackMember.projectIds?.includes(p.id));
          setProjects(fallbackProjects.length > 0 ? fallbackProjects : PROJECTS_DATA.slice(0, 3));
          setError(null);
        } else {
          setError('Không tìm thấy thông tin tổ chức.');
        }
        setLoading(false);
      });
  }, [memberId]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Spin size="large" tip="Đang tải thông tin chi tiết..." />
      </div>
    );
  }

  if (error || !member) {
    return (
      <Container className="py-section text-center">
        <h2 className="text-h2 font-bold text-neutral-900">Không tìm thấy tổ chức</h2>
        <p className="mt-2 text-neutral-600">{error || 'Tổ chức thành viên không tồn tại hoặc đã bị gỡ bỏ.'}</p>
      </Container>
    );
  }

  return (
    <div className="py-section-sm lg:py-section">
      <Container>
        <div className="mb-14">
          <div className="mb-10 flex flex-row items-start justify-between gap-4 lg:gap-8">
            <div className="min-w-0 flex-1 max-w-4xl">
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
                {member.country} &nbsp;·&nbsp; {member.shortDescription} &nbsp;·&nbsp; Thành viên từ:{' '}
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

            <SupportCTA onClick={openSupport} />
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
              Về tổ chức
            </h2>
            <p className="leading-relaxed text-neutral-700">{member.description}</p>
            {member.socialLinks.length > 0 && <SocialLinks links={member.socialLinks} className="mt-4" />}
          </div>

          <div>
            <h2
              className="mb-6 font-semibold text-black"
              style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 'clamp(1.5rem, 2.29vw, 2.75rem)', lineHeight: '140%' }}
            >
              Đại diện tổ chức
            </h2>
            <p className="leading-relaxed text-neutral-700">{member.leader ?? 'TBD'}</p>
          </div>
        </div>

        {projects.length > 0 && (
          <div className="mb-10">
            <SectionHeading title="Dự án của chúng tôi" align="left" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {member.gallery.length > 0 && (
          <div className="mb-10">
            <SectionHeading title="Hoạt động nổi bật" align="left" />
            <ImageGallery images={member.gallery} maxVisible={7} variant="featured" />
          </div>
        )}
      </Container>

      <CTABanner
        title="Ready to Make an Impact?"
        description="Join thousands of youth leaders across ASEAN who are making a difference in their communities."
        ctaLabel="Register Now"
        onCtaClick={goToJoin}
      />
    </div>
  );
}
