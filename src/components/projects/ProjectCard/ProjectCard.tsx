import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { Icon } from '@/components/ui/Icon';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/routes/paths';
import type { Project } from '@/types';

export interface ProjectCardProps {
  project: Project;
  ledBy?: string;
  className?: string;
}

export function ProjectCard({ project, ledBy, className }: ProjectCardProps) {
  const navigate = useNavigate();
  const effectiveLedBy = ledBy || (project as any).ledBy;

  return (
    <div
      className={cn(
        'group flex flex-col w-full h-full cursor-pointer',
        // rounded-2xl on outer card → shadow corners match image top corners
        'rounded-2xl bg-white overflow-hidden shadow-sm',
        'transition-all duration-300 ease-out hover:-translate-y-1.5',
        'hover:shadow-[0_12px_32px_rgba(0,0,0,0.10)]',
        'will-change-transform',
        className
      )}
      onClick={() => navigate(ROUTES.PROJECT_DETAIL(project.id))}
    >
      {/* Image — top corners only (outer card handles full rounding) */}
      <div className="w-full overflow-hidden flex-shrink-0" style={{ aspectRatio: '421/237' }}>
        <ImageWithFallback
          src={project.outstandingImageUrl}
          alt={project.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out will-change-transform"
          loading="lazy"
        />
      </div>

      {/* Content — flex-1 + justify-between to ensure cards stretch equally and footer sticks to bottom */}
      <div className="flex flex-col flex-1 justify-between p-5 pt-4">
        {/* Title — minHeight reserves exactly 2 lines so 1-line and 2-line titles take equal space */}
        <h3
          className="line-clamp-2 font-semibold text-[#0F172A] transition-colors duration-300 group-hover:text-[#005D9A]"
          style={{
            fontSize: 'clamp(1rem, 1.1vw, 1.25rem)',
            fontFamily: 'Open Sans, sans-serif',
            lineHeight: '140%',
            minHeight: '2.8em',
          }}
          title={project.name}
        >
          {project.name}
        </h3>

        {/* Footer info: Led by & Region + Action Arrow */}
        <div className="flex items-end justify-between gap-3 mt-4 pt-2">
          <div className="flex flex-col gap-[6px] flex-1 min-w-0">
            {/* Led by */}
            <div className="flex items-baseline gap-1.5 min-w-0">
              <span
                className="flex-shrink-0"
                style={{
                  fontSize: 'clamp(0.75rem, 0.83vw, 0.9375rem)',
                  fontFamily: 'Open Sans, sans-serif',
                  fontWeight: 400,
                  color: '#6B7280',
                  lineHeight: '140%',
                }}
              >
                Led by
              </span>
              <span
                className="truncate"
                title={effectiveLedBy || '—'}
                style={{
                  fontSize: 'clamp(0.75rem, 0.83vw, 0.9375rem)',
                  fontFamily: 'Open Sans, sans-serif',
                  fontWeight: 500,
                  color: effectiveLedBy ? '#0F172A' : '#9CA3AF',
                  lineHeight: '140%',
                }}
              >
                {effectiveLedBy || '—'}
              </span>
            </div>

            {/* Region */}
            <div className="flex items-baseline gap-1.5 min-w-0">
              <span
                className="flex-shrink-0"
                style={{
                  fontSize: 'clamp(0.75rem, 0.83vw, 0.9375rem)',
                  fontFamily: 'Open Sans, sans-serif',
                  fontWeight: 400,
                  color: '#6B7280',
                  lineHeight: '140%',
                }}
              >
                Region
              </span>
              <span
                className="truncate"
                style={{
                  fontSize: 'clamp(0.75rem, 0.83vw, 0.9375rem)',
                  fontFamily: 'Open Sans, sans-serif',
                  fontWeight: 400,
                  color: '#000000',
                  lineHeight: '140%',
                }}
              >
                {project.region || '—'}
              </span>
            </div>
          </div>

          {/* Arrow button — fills red on hover, arrow turns white */}
          <Button
            type="text"
            shape="circle"
            className="!mt-0.5 !h-8 !w-8 !min-w-0 !flex-shrink-0 !bg-white !text-[#EE334E] transition-all duration-200 group-hover:!bg-[#EE334E] group-hover:!text-white group-hover:!shadow-md hover:!scale-110 active:!scale-95"
            style={{ border: '1px solid #EE334E', padding: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(ROUTES.PROJECT_DETAIL(project.id));
            }}
            aria-label={`View ${project.name}`}
          >
            <span className="relative flex h-4 w-4 items-center justify-center">
              <Icon
                name="lucide:arrow-up-right"
                size={16}
                className="absolute transition-opacity duration-200 group-hover:opacity-0"
              />
              <Icon
                name="lucide:arrow-right"
                size={16}
                className="absolute opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
