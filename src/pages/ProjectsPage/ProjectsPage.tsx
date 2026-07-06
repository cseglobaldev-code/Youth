// src/pages/ProjectsPage/ProjectsPage.tsx
import { useState, useMemo, useEffect } from 'react';
import { Button, Empty, Input, Select, Spin } from 'antd';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { ProjectCard } from '@/components/common/ProjectCard';
import { filterBySdg } from '@/lib/utils';
import { SDGS_DATA } from '@/data';
import { StrapiService } from '@/lib/strapi';
import { ICONS } from '@/config/icons';
import { cn } from '@/lib/utils';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { Project, Member } from '@/types';

const MAX_VISIBLE = 8;

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [showAllFilters, setShowAllFilters] = useState(false);

  const { ref: heroRef, visible: heroVisible } = useScrollReveal(0.05);
  const { ref: cardsRef, visible: cardsVisible } = useScrollReveal(0.05);

  useEffect(() => {
    Promise.all([
      StrapiService.getProjects(),
      StrapiService.getMembers()
    ])
      .then(([projectData, memberData]) => {
        setProjects(projectData);
        setMembers(memberData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Không thể tải các dự án. Vui lòng thử lại sau.');
        setLoading(false);
      });
  }, []);

  const memberMap = useMemo(() => {
    return Object.fromEntries(members.map((m) => [m.id, m.name]));
  }, [members]);

  const filterItems = useMemo(() => {
    return [
      { key: 'all', label: 'All Project' },
      ...SDGS_DATA.filter((sdg) => projects.some((p) => p.focusSdgs.includes(sdg.id))).map(
        (sdg) => ({ key: `sdg-${sdg.id}`, label: `SDG ${sdg.id} – ${sdg.title}` })
      ),
    ];
  }, [projects]);

  const visibleFilters = showAllFilters ? filterItems : filterItems.slice(0, MAX_VISIBLE);
  const hasMore = filterItems.length > MAX_VISIBLE;

  const filteredProjects = useMemo(() => {
    let result = filterBySdg(projects, activeFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }
    return [...result].sort((a, b) => {
      const ya = a.year ?? 0;
      const yb = b.year ?? 0;
      return sortOrder === 'newest' ? yb - ya : ya - yb;
    });
  }, [projects, activeFilter, searchQuery, sortOrder]);

  return (
    <div>
      <Container>
        <div className="flex flex-col items-center gap-6 lg:gap-[40px] pt-10 lg:pt-[80px]">
          <div
            ref={heroRef as React.RefObject<HTMLDivElement>}
            className={cn(
              'flex flex-col items-center gap-4 lg:gap-6 w-full transition-all duration-700',
              heroVisible ? 'animate-fade-in-up' : 'opacity-0'
            )}
          >
            <div className="flex justify-center items-center w-full gap-4 lg:gap-6 flex-wrap">
              <span
                className="font-semibold bg-clip-text text-transparent"
                style={{
                  fontSize: 'clamp(2.25rem, 4.17vw, 5rem)',
                  lineHeight: '110%',
                  fontFamily: 'Open Sans, sans-serif',
                  backgroundImage:
                    'linear-gradient(90deg, #EE334E 0%, #FCB131 33%, #00A651 67%, #0081C8 100%)',
                }}
              >
                SDGs
              </span>
              <span
                className="font-semibold text-black"
                style={{ fontSize: 'clamp(2.25rem, 4.17vw, 5rem)', lineHeight: '110%', fontFamily: 'Open Sans, sans-serif' }}
              >
                Projects
              </span>
            </div>
            <p
              className="text-black font-normal text-center mx-auto"
              style={{
                fontSize: 'clamp(0.9375rem, 1.35vw, 1.625rem)',
                lineHeight: '140%',
                maxWidth: '1056px',
                fontFamily: 'Open Sans, sans-serif',
              }}
            >
              Explore the initiatives our member organizations are running in alignment with the United Nations&apos; 17 Sustainable Development Goals.
            </p>
          </div>

          <div className="flex flex-col w-full gap-8 lg:gap-[60px] pb-10 lg:pb-[80px]">
            <div className="flex flex-wrap justify-center gap-[11px]">
              {visibleFilters.map((item) => (
                <Button
                  key={item.key}
                  shape="round"
                  onClick={() => setActiveFilter(item.key)}
                  className={cn(
                    '!font-medium !transition-all !duration-200 !whitespace-nowrap hover:!scale-[1.03] active:!scale-[0.97] !h-auto',
                    activeFilter === item.key ? '!text-white !shadow-md' : '!text-[#151515]'
                  )}
                  style={{
                    fontSize: 'clamp(0.8rem, 1.04vw, 1.25rem)',
                    backgroundColor: activeFilter === item.key ? '#005D9A' : '#E3F2FD',
                    borderColor: activeFilter === item.key ? '#005D9A' : '#E3F2FD',
                    fontFamily: 'Open Sans, sans-serif',
                    lineHeight: '140%',
                    padding: 'clamp(8px,0.8vw,10px) clamp(14px,1.25vw,24px)',
                  }}
                >
                  {item.label}
                </Button>
              ))}

              {hasMore && (
                <Button
                  shape="round"
                  onClick={() => setShowAllFilters((prev) => !prev)}
                  className="!font-medium !transition-all !duration-200 !whitespace-nowrap hover:!scale-[1.03] active:!scale-[0.97] !h-auto !text-[#151515]"
                  style={{
                    fontSize: 'clamp(0.8rem, 1.04vw, 1.25rem)',
                    backgroundColor: '#E3F2FD',
                    borderColor: '#E3F2FD',
                    fontFamily: 'Open Sans, sans-serif',
                    lineHeight: '140%',
                    padding: 'clamp(8px,0.8vw,10px) clamp(14px,1.25vw,24px)',
                  }}
                >
                  {showAllFilters ? 'Less' : 'More'}
                </Button>
              )}
            </div>

            <div className="flex flex-wrap justify-center items-center gap-5">
              <Input
                placeholder="Từ khóa"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                suffix={<Icon name={ICONS.search} size={20} color="#CDCED7" />}
                style={{
                  borderRadius: 100,
                  borderColor: '#CDCED7',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 14,
                  color: '#151515',
                }}
                className="h-[50px] w-full max-w-[302px]"
              />

              <Select
                value={sortOrder}
                onChange={(v) => setSortOrder(v)}
                options={[
                  { value: 'newest', label: 'Mới nhất - cũ nhất' },
                  { value: 'oldest', label: 'Cũ nhất - mới nhất' },
                ]}
                suffixIcon={<Icon name={ICONS.chevronDown} size={16} color="#000" />}
                className="you-sort-select h-[50px] w-full max-w-[302px]"
              />
            </div>

            {loading ? (
              <div className="py-20 text-center">
                <Spin size="large" tip="Đang tải các dự án..." />
              </div>
            ) : error ? (
              <div className="py-20 text-center text-red-500">
                <p>{error}</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <Empty description="No projects found for this SDG." className="py-12" />
            ) : (
              <div
                ref={cardsRef as React.RefObject<HTMLDivElement>}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10"
              >
                {filteredProjects.map((project, index) => (
                  <div
                    key={`${activeFilter}-${project.id}`}
                    className={cn(cardsVisible ? 'animate-fade-in-up' : 'opacity-0')}
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <ProjectCard
                      project={project}
                      ledBy={memberMap[project.memberId] || 'TBD'}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}