import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Card } from '@/components/common/Card';
import { SDGTag } from '@/components/ui/SDGTag';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/routes/paths';
import type { Project } from '@/types';

export interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      hoverable
      padding="none"
      className={cn('flex flex-col', className)}
      onClick={() => navigate(ROUTES.PROJECT_DETAIL(project.id))}
    >
      <div className="h-48 bg-neutral-100 overflow-hidden relative">
        <img
          src={project.outstandingImageUrl}
          alt={project.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <Badge
          variant={project.status === 'ongoing' ? 'success' : project.status === 'completed' ? 'default' : 'warning'}
          className="absolute top-3 right-3"
        >
          {project.status}
        </Badge>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2">{project.name}</h3>
        <p className="text-sm text-neutral-600 line-clamp-2 mb-3 flex-1">{project.description}</p>
        <div className="flex flex-wrap gap-1">
          {project.focusSdgs.slice(0, 3).map((sdgId) => (
            <SDGTag key={sdgId} sdgId={sdgId} size="sm" variant="soft" />
          ))}
        </div>
      </div>
    </Card>
  );
}
