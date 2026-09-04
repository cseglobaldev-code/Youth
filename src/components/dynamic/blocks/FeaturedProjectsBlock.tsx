import { ProjectCard } from '@/components/projects/ProjectCard';
import { ViewAllButton } from '@/components/shared/ViewAllButton';
import { ROUTES } from '@/routes/paths';
import type { FeaturedProjectsBlockData } from '@/types';

export function FeaturedProjectsBlock({ data }: { data: FeaturedProjectsBlockData }) {
  const projects = (data.projects || []).slice(0, data.limit || 3);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-semibold text-2xl md:text-4xl text-neutral-900" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            {data.title}
          </h2>
          {data.subtitle && <p className="mt-2 text-neutral-600">{data.subtitle}</p>}
        </div>
        {data.showViewAll && <ViewAllButton to={ROUTES.PROJECTS} />}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}