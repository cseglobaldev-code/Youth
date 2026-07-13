// src/pages/ProjectDetailPage/ProjectDetailPage.tsx
import { useParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { Divider, Image, Spin } from 'antd';
import { Icon } from '@/components/ui/Icon';
import { ProjectCard } from '@/components/common/ProjectCard';
import { SupportCTA } from '@/components/common/SupportCTA';
import { useSupportModal } from '@/components/common/SupportModal';
import { SDGTag } from '@/components/ui/SDGTag';
import { Container } from '@/components/ui/Container';
import { StrapiService } from '@/lib/strapi';
import { PROJECTS_DATA, MEMBERS_DATA } from '@/data'; 
import { cn } from '@/lib/utils';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { Project, Member } from '@/types';

const SOCIAL_ICON_MAP: Record<string, string> = {
  youtube: 'mdi:youtube',
  facebook: 'mdi:facebook',
  twitter: 'fa6-brands:x-twitter',
  instagram: 'mdi:instagram',
  linkedin: 'mdi:linkedin',
  tiktok: 'ic:baseline-tiktok',
};

interface DetailRowProps {
  label: string;
  uploadLink?: boolean;
  children: React.ReactNode;
}

function DetailRow({ label, uploadLink, children }: DetailRowProps) {
  return (
    <div className="flex items-start w-full gap-2">
      <div className="flex-shrink-0 w-[120px] sm:w-[140px] lg:w-[220px] xl:w-[300px]">
        <span
          style={{
            fontFamily: 'Open Sans, sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(0.8rem, 1.04vw, 1.25rem)',
            lineHeight: '140%',
            color: '#151515',
          }}
        >
          {label}
        </span>
      </div>
      <div className="flex-1 min-w-0">{children}</div>
      {uploadLink && (
        <a
          href="#"
          className="flex-shrink-0 flex items-center gap-1 ml-2 lg:ml-6 hover:opacity-75 transition-opacity"
          style={{
            fontFamily: 'Open Sans, sans-serif',
            fontWeight: 600,
            fontSize: 'clamp(0.8rem, 1.04vw, 1.25rem)',
            color: '#EE334E',
            textDecoration: 'none',
          }}
        >
          <span className="hidden sm:inline">Link to upload</span>
          <Icon name="solar:arrow-right-up-bold" size={18} color="#EE334E" />
        </a>
      )}
    </div>
  );
}

const VALUE_STYLE: React.CSSProperties = {
  fontFamily: 'Open Sans, sans-serif',
  fontWeight: 500,
  fontSize: 'clamp(0.8rem, 1.04vw, 1.25rem)',
  lineHeight: '140%',
  color: '#000000',
};

const GRADIENT_DIVIDER =
  'linear-gradient(90deg, rgba(194,211,239,0) 0%, rgba(194,211,239,1) 20%, rgba(194,211,239,1) 80%, rgba(194,211,239,0) 100%)';

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { openSupport } = useSupportModal();

  const [project, setProject] = useState<Project | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [membersList, setMembersList] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { ref: orgRef, visible: orgVisible } = useScrollReveal();
  const { ref: detailRef, visible: detailVisible } = useScrollReveal();
  const { ref: otherRef, visible: otherVisible } = useScrollReveal();

  useEffect(() => {
    if (!projectId) return;

    Promise.all([
      StrapiService.getProjectById(projectId),
      StrapiService.getProjects(),
      StrapiService.getMembers()
    ])
      .then(([projData, projectList, memberList]) => {
        setProject(projData);
        setAllProjects(projectList.length > 0 ? projectList : PROJECTS_DATA);
        setMembersList(memberList.length > 0 ? memberList : MEMBERS_DATA);
        
        if (projData.memberId) {
          const associatedMember = memberList.find((m: Member) => m.id === projData.memberId);
          if (associatedMember) setMember(associatedMember);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('API failed, falling back to static project details:', err);
        const fallbackProj = PROJECTS_DATA.find((p) => p.id === projectId);
        if (fallbackProj) {
          setProject(fallbackProj);
          setAllProjects(PROJECTS_DATA);
          setMembersList(MEMBERS_DATA);
          const associatedMember = MEMBERS_DATA.find((m) => m.id === fallbackProj.memberId);
          if (associatedMember) setMember(associatedMember);
          setError(null);
        } else {
          setError('Không tìm thấy thông tin dự án.');
        }
        setLoading(false);
      });
  }, [projectId]);

  const memberMap = useMemo(() => {
    return Object.fromEntries(membersList.map((m) => [m.id, m.name]));
  }, [membersList]);

  const otherProjects = useMemo(() => {
    if (!project) return [];
    return allProjects.filter((p) => p.id !== project.id).slice(0, 3);
  }, [allProjects, project]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Spin size="large" tip="Đang tải chi tiết dự án..." />
      </div>
    );
  }

  if (error || !project) {
    return (
      <Container className="py-section text-center">
        <h2 className="text-h2 font-bold text-neutral-900">Không tìm thấy dự án</h2>
        <p className="mt-2 text-neutral-600">{error || 'Dự án này không tồn tại hoặc đã bị gỡ bỏ.'}</p>
      </Container>
    );
  }

  return (
    <div>
      <Container>
        <div className="pt-10 lg:pt-[120px] flex flex-col md:flex-row md:items-start md:justify-between gap-4 lg:gap-8 xl:gap-10">
          <div className="flex flex-col gap-4 lg:gap-6 min-w-0 flex-1 xl:max-w-[1024px] animate-fade-in-up">
            <h1
              className="font-semibold text-black"
              style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: 'clamp(2rem, 4.17vw, 5rem)',
                lineHeight: '110%',
              }}
            >
              {project.name}
            </h1>

            <div className="flex flex-col gap-3 lg:gap-4">
              <p
                style={{
                  fontFamily: 'Open Sans, sans-serif',
                  fontWeight: 400,
                  fontSize: 'clamp(0.9375rem, 1.25vw, 1.5rem)',
                  lineHeight: '140%',
                  color: '#151515',
                }}
              >
                {project.countriesCovered.join(', ')} &nbsp;·&nbsp; Led by {member?.name || 'TBD'}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.focusSdgs.map((sdgId) => (
                  <SDGTag
                    key={sdgId}
                    sdgId={sdgId}
                    variant="solid"
                    size="md"
                    className="!rounded-[6px] transition-transform duration-200 hover:scale-105"
                  />
                ))}
              </div>
            </div>
          </div>

          <SupportCTA onClick={openSupport} />
        </div>
      </Container>

      <Container className="mt-6 lg:mt-[74px] mb-8 lg:mb-[120px]">
        <div className="rounded-[20px] lg:rounded-[40px] overflow-hidden" style={{ height: 'clamp(240px, 32.7vw, 628px)' }}>
          <Image
            src={project.outstandingImageUrl}
            alt={project.name}
            preview={false}
            className="w-full h-full object-cover"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            wrapperStyle={{ width: '100%', height: '100%' }}
          />
        </div>
      </Container>

      <Container className="pb-10 lg:pb-[175px]">
        <div className="flex flex-col gap-10 lg:gap-[80px]">
          <div
            ref={orgRef as React.RefObject<HTMLDivElement>}
            className={cn('max-w-[746px] transition-all duration-700', orgVisible ? 'animate-fade-in-up' : 'opacity-0')}
          >
            <div className="flex flex-col gap-4 lg:gap-6">
              <h2
                className="font-semibold text-black"
                style={{
                  fontFamily: 'Open Sans, sans-serif',
                  fontSize: 'clamp(1.5rem, 2.29vw, 2.75rem)',
                  lineHeight: '140%',
                }}
              >
                Organization
              </h2>
              {member?.description && (
                <p
                  style={{
                    fontFamily: 'Open Sans, sans-serif',
                    fontWeight: 400,
                    fontSize: 'clamp(0.875rem, 1.04vw, 1.25rem)',
                    lineHeight: '150%',
                    color: '#000000',
                  }}
                >
                  {member.description}
                </p>
              )}
              {member?.socialLinks && member.socialLinks.length > 0 && (
                <div className="flex gap-4 flex-wrap">
                  {member.socialLinks.map((link) => {
                    const iconName = SOCIAL_ICON_MAP[link.platform.toLowerCase()];
                    if (!iconName) return null;
                    return (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:text-[#005D9A] transition-colors duration-200 hover:scale-110 transform"
                      >
                        <Icon name={iconName} size={24} />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <Divider style={{ background: GRADIENT_DIVIDER, margin: 0 }} />

          <div
            ref={detailRef as React.RefObject<HTMLDivElement>}
            className={cn('flex flex-col gap-4 lg:gap-6 transition-all duration-700', detailVisible ? 'animate-fade-in-up' : 'opacity-0')}
          >
            <DetailRow label="Project name">
              <span style={VALUE_STYLE}>{project.name}</span>
            </DetailRow>

            <DetailRow label="Project Description" uploadLink>
              <span style={VALUE_STYLE}>{project.description}</span>
            </DetailRow>

            <DetailRow label="Indication of Impact" uploadLink>
              <span style={VALUE_STYLE}>{project.impactIndication}</span>
            </DetailRow>

            <DetailRow label="Region">
              <span style={VALUE_STYLE}>{project.region}</span>
            </DetailRow>

            <DetailRow label="Countries covered">
              <span style={VALUE_STYLE}>{project.countriesCovered.join(', ')}</span>
            </DetailRow>

            <DetailRow label="Focus SDGs">
              <div className="flex flex-wrap gap-2">
                {project.focusSdgs.map((sdgId) => (
                  <SDGTag
                    key={sdgId}
                    sdgId={sdgId}
                    variant="solid"
                    size="md"
                    className="!rounded-[6px] !py-1.5 !px-4"
                  />
                ))}
              </div>
            </DetailRow>

            <DetailRow label="Status">
              <span style={VALUE_STYLE}>{project.status}</span>
            </DetailRow>

            <DetailRow label="Outstanding Project Image" uploadLink>
              <span style={{ ...VALUE_STYLE, color: '#EE334E' }}>
                Create new folder with format &ldquo;Project name_Project Image&rdquo;
              </span>
            </DetailRow>
          </div>

          <div
            ref={otherRef as React.RefObject<HTMLDivElement>}
            className={cn('flex flex-col gap-4 lg:gap-6 transition-all duration-700', otherVisible ? 'animate-fade-in-up' : 'opacity-0')}
          >
            <h2
              className="font-semibold text-black"
              style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: 'clamp(1.5rem, 2.29vw, 2.75rem)',
                lineHeight: '140%',
              }}
            >
              Other Projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
              {otherProjects.map((p, index) => (
                <div
                  key={p.id}
                  className={cn(otherVisible ? 'animate-fade-in-up' : 'opacity-0')}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <ProjectCard project={p} ledBy={memberMap[p.memberId] || 'TBD'} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}