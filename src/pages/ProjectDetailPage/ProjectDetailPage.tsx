import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Divider, Popover, Skeleton } from 'antd';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { SupportCTA } from '@/components/shared/SupportCTA';
import { useSupportModal } from '@/components/modals/SupportModal';
import { SDGTag } from '@/components/ui/SDGTag';
import { Container } from '@/components/ui/Container';
import { ImageGallery } from '@/components/shared/ImageGallery';
import { SocialLinks } from '@/components/shared/SocialLinks';
import {
  fetchProjectById,
  fetchRelatedProjects,
  type ProjectDetailItem,
  type ProjectListItem,
} from '@/api/projects';
import { ROUTES } from '@/routes/paths';
import { cn } from '@/lib/utils';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const STATUS_LABELS: Record<string, string> = {
  ongoing: 'Ongoing',
  planned: 'Planning',
  completed: 'Completed',
};

interface DetailRowProps {
  label: string;
  children: React.ReactNode;
}

function DetailRow({ label, children }: DetailRowProps) {
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

  const [project, setProject] = useState<ProjectDetailItem | null>(null);
  const [otherProjects, setOtherProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { ref: orgRef, visible: orgVisible } = useScrollReveal();
  const { ref: detailRef, visible: detailVisible } = useScrollReveal();
  const { ref: otherRef, visible: otherVisible } = useScrollReveal();

  useEffect(() => {
    if (!projectId) return;
    const controller = new AbortController();

    setLoading(true);
    Promise.all([
      fetchProjectById(projectId, { signal: controller.signal }),
      fetchRelatedProjects(projectId, 3, { signal: controller.signal }),
    ])
      .then(([detail, related]) => {
        setProject(detail);
        setOtherProjects(related);
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
        console.error('Failed to load project from CMS', requestError);
        setProject(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [projectId]);

  if (loading) {
    return (
      <Container className="py-section">
        <Skeleton active paragraph={{ rows: 6 }} />
      </Container>
    );
  }

  if (!project) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-neutral-900">
          Project Not Found
        </h2>
      </div>
    );
  }

  return (
    <div>
      <Container>
        <div className="pt-10 lg:pt-[120px] flex flex-col md:flex-row md:items-start md:justify-between gap-4 lg:gap-8 xl:gap-10">
          <div className="flex flex-col gap-4 lg:gap-6 min-w-0 flex-1 animate-fade-in-up">
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
                {project.countriesCovered.length > 0 && (
                  <>{project.countriesCovered.join(', ')} &nbsp;·&nbsp; </>
                )}
                Led by{' '}
                {project.memberId ? (
                  <Link
                    to={ROUTES.MEMBER_DETAIL(project.memberId)}
                    className="underline decoration-1 underline-offset-2 transition-colors duration-200 hover:text-[#005D9A]"
                  >
                    {project.ledBy}
                  </Link>
                ) : (
                  project.ledBy
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.focusSdgs.map((sdgId) => (
                  <SDGTag
                    key={sdgId}
                    sdgId={sdgId}
                    variant="solid"
                    size="md"
                    className="!rounded-[6px] transition-transform duration-200 hover:scale-105"
                    style={{
                      padding: 'clamp(6px,0.5vw,10px) clamp(12px,1.25vw,24px)',
                      fontSize: 'clamp(0.75rem, 1.04vw, 1.25rem)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {project.status === 'completed' ? (
            <Popover
              trigger="click"
              content={
                <div style={{ maxWidth: 280, fontFamily: 'Open Sans, sans-serif' }}>
                  This project has been completed / is no longer active. You can support this
                  organization&apos;s other projects{' '}
                  <Link to={ROUTES.MEMBER_DETAIL(project.memberId)} className="text-[#005D9A] underline">
                    here
                  </Link>
                  .
                </div>
              }
            >
              <SupportCTA onClick={() => {}} disabled />
            </Popover>
          ) : (
            <SupportCTA onClick={openSupport} />
          )}
        </div>
      </Container>

      <Container className="mt-6 lg:mt-[74px] mb-8 lg:mb-[120px]">
        <div
          className="rounded-[20px] lg:rounded-[40px] overflow-hidden"
          style={{
            background: '#0068A5',
            height: 'clamp(240px, 32.7vw, 628px)',
          }}
        >
          <ImageWithFallback
            src={project.outstandingImageUrl}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        </div>
      </Container>

      <Container className="pb-10 lg:pb-[175px]">
        <div className="flex flex-col gap-10 lg:gap-[80px]">
          <div
            ref={orgRef}
            className={cn(
              'max-w-[746px] transition-all duration-700',
              orgVisible ? 'animate-fade-in-up' : 'opacity-0'
            )}
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
              {project.memberDescription && (
                <p
                  style={{
                    fontFamily: 'Open Sans, sans-serif',
                    fontWeight: 400,
                    fontSize: 'clamp(0.875rem, 1.04vw, 1.25rem)',
                    lineHeight: '150%',
                    color: '#000000',
                  }}
                >
                  {project.memberDescription}
                </p>
              )}
              {project.memberSocialLinks.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-black">Follow us:</span>
                  <SocialLinks links={project.memberSocialLinks} size={24} />
                </div>
              )}
            </div>
          </div>

          <Divider style={{ background: GRADIENT_DIVIDER, margin: 0 }} />

          <div
            ref={detailRef}
            className={cn(
              'flex flex-col gap-4 lg:gap-6 transition-all duration-700',
              detailVisible ? 'animate-fade-in-up' : 'opacity-0'
            )}
          >
            <DetailRow label="Project name">
              <span style={VALUE_STYLE}>{project.name}</span>
            </DetailRow>

            <DetailRow label="Project Description">
              <span style={VALUE_STYLE}>{project.description}</span>
            </DetailRow>

            <DetailRow label="Indication of Impact">
              <span style={VALUE_STYLE}>{project.impactIndication}</span>
            </DetailRow>

            <DetailRow label="Region">
              <span style={VALUE_STYLE}>{project.region}</span>
            </DetailRow>

            <DetailRow label="Countries covered">
              <span style={VALUE_STYLE}>
                {project.countriesCovered.join(', ')}
              </span>
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
              <span style={VALUE_STYLE}>{STATUS_LABELS[project.status] ?? project.status}</span>
            </DetailRow>
          </div>

          {project.gallery && project.gallery.length > 0 && (
            <div>
              <h2
                className="font-semibold text-black mb-6"
                style={{
                  fontFamily: 'Open Sans, sans-serif',
                  fontSize: 'clamp(1.5rem, 2.29vw, 2.75rem)',
                  lineHeight: '140%',
                }}
              >
                Project Activities Gallery
              </h2>
              <ImageGallery images={project.gallery} variant="featured" maxVisible={7} />
            </div>
          )}

          {otherProjects.length > 0 && (
            <div
              ref={otherRef}
              className={cn(
                'flex flex-col gap-4 lg:gap-6 transition-all duration-700',
                otherVisible ? 'animate-fade-in-up' : 'opacity-0'
              )}
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
                    className={cn(
                      otherVisible ? 'animate-fade-in-up' : 'opacity-0'
                    )}
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <ProjectCard project={p} ledBy={p.ledBy} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}