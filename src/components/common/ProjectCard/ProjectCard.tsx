import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { Icon } from '@/components/ui/Icon';
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

  return (
    <div
      className={cn(
        'group flex flex-col gap-6 cursor-pointer',
        // rounded-2xl on outer card → shadow corners match image top corners
        'rounded-2xl bg-white',
        'transition-all duration-300 ease-out hover:-translate-y-1.5',
        'hover:shadow-[0_12px_32px_rgba(0,0,0,0.10)]',
        'will-change-transform',
        className
      )}
      onClick={() => navigate(ROUTES.PROJECT_DETAIL(project.id))}
    >
      {/* Image — top corners only (outer card handles full rounding) */}
      <div className="w-full rounded-t-2xl overflow-hidden" style={{ aspectRatio: '421/237' }}>
        <img
          src={project.outstandingImageUrl}
          alt={project.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out will-change-transform"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 px-4 pb-4">
        <h3
          className="font-semibold text-[#0F172A] line-clamp-2"
          style={{
            fontSize: 'clamp(1rem, 1.1vw, 1.25rem)',
            fontFamily: 'Open Sans, sans-serif',
            lineHeight: '140%',
          }}
        >
          {project.name}
        </h3>

        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-[6px] flex-1">
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
              {ledBy && (
                <span
                  className="truncate"
                  title={ledBy}
                  style={{
                    fontSize: 'clamp(0.75rem, 0.83vw, 0.9375rem)',
                    fontFamily: 'Open Sans, sans-serif',
                    fontWeight: 500,
                    color: '#0F172A',
                    lineHeight: '140%',
                  }}
                >
                  {ledBy}
                </span>
              )}
            </div>

            {/* Local */}
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
                Local
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
                {project.countriesCovered.slice(0, 2).join(', ')}
              </span>
            </div>
          </div>

          {/* Arrow button — fills red on hover, arrow turns white */}
          <Button
            type="text"
            shape="circle"
            className="!w-8 !h-8 !bg-white !text-[#EE334E] !flex-shrink-0 transition-all duration-200 hover:!bg-[#EE334E] hover:!text-white hover:!scale-110 hover:!shadow-md active:!scale-95 !min-w-0 mt-0.5"
            style={{ border: '1px solid #EE334E', padding: 0 }}
            onClick={(e) => { e.stopPropagation(); navigate(ROUTES.PROJECT_DETAIL(project.id)); }}
            aria-label={`View ${project.name}`}
          >
            <Icon name="mdi:arrow-top-right" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
