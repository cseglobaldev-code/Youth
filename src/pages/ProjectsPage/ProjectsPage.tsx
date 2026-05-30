import { useState, useMemo } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { ProjectCard } from '@/components/common/ProjectCard';
import { FilterTabs } from '@/components/common/FilterTabs';
import { filterBySdg } from '@/lib/utils';
import { PROJECTS_DATA, SDGS_DATA } from '@/data';

export function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filterItems = useMemo(
    () => [
      { key: 'all', label: 'All' },
      ...SDGS_DATA.filter((sdg) => PROJECTS_DATA.some((p) => p.focusSdgs.includes(sdg.id))).map(
        (sdg) => ({ key: `sdg-${sdg.id}`, label: sdg.code })
      ),
    ],
    []
  );

  const filteredProjects = useMemo(
    () => filterBySdg(PROJECTS_DATA, activeFilter),
    [activeFilter]
  );

  return (
    <div className="py-section-sm lg:py-section">
      <Container>
        <SectionHeading
          eyebrow="Impact"
          title="Our Projects"
          description="Explore youth-led projects making a difference across the globe."
        />

        <FilterTabs
          items={filterItems}
          activeKey={activeFilter}
          onChange={setActiveFilter}
          className="mb-8"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <p className="text-center text-neutral-500 py-12">No projects found for this SDG.</p>
        )}
      </Container>
    </div>
  );
}
