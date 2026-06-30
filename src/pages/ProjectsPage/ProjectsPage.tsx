import { useState, useMemo } from 'react';
import { Button, Empty, Input, Select } from 'antd';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { ProjectCard } from '@/components/common/ProjectCard';
import { filterBySdg } from '@/lib/utils';
import { PROJECTS_DATA, SDGS_DATA, MEMBERS_DATA } from '@/data';
import { ICONS } from '@/config/icons';
import { cn } from '@/lib/utils';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const MEMBER_MAP = Object.fromEntries(MEMBERS_DATA.map((m) => [m.id, m.name]));

const MAX_VISIBLE = 8; // "All Project" + 7 SDGs

export function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [showAllFilters, setShowAllFilters] = useState(false);
  const { ref: heroRef, visible: heroVisible } = useScrollReveal(0.05);
  const { ref: cardsRef, visible: cardsVisible } = useScrollReveal(0.05);

  const filterItems = useMemo(
    () => [
      { key: 'all', label: 'All Project' },
      ...SDGS_DATA.filter((sdg) => PROJECTS_DATA.some((p) => p.focusSdgs.includes(sdg.id))).map(
        (sdg) => ({ key: `sdg-${sdg.id}`, label: `SDG ${sdg.id} – ${sdg.title}` })
      ),
    ],
    []
  );

  const visibleFilters = showAllFilters ? filterItems : filterItems.slice(0, MAX_VISIBLE);
  const hasMore = filterItems.length > MAX_VISIBLE;

  const filteredProjects = useMemo(() => {
    let result = filterBySdg(PROJECTS_DATA, activeFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }
    return [...result].sort((a, b) => {
      const ya = a.year ?? 0;
      const yb = b.year ?? 0;
      return sortOrder === 'newest' ? yb - ya : ya - yb;
    });
  }, [activeFilter, searchQuery, sortOrder]);

  return (
    <div>
      <Container>
          <div className="flex flex-col items-center gap-6 lg:gap-[40px] pt-10 lg:pt-[80px]">

            {/* Hero */}
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
                Explore the initiatives our member organizations are running in alignment with the
                United Nations&apos; 17 Sustainable Development Goals. Filter by goal to find
                projects in your area of interest.
              </p>
            </div>

            {/* Filter + Cards */}
            <div className="flex flex-col w-full gap-8 lg:gap-[60px] pb-10 lg:pb-[80px]">

              {/* Filter pills */}
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

              {/* Search + Sort row */}
              <div className="flex flex-wrap justify-center items-center gap-5">
                {/* Search input */}
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
                  className="h-[50px] w-full max-w-[302px] [&_.ant-input]:text-[#151515] [&_.ant-input::placeholder]:text-[#CDCED7]"
                />

                {/* Sort dropdown */}
                <Select
                  value={sortOrder}
                  onChange={(v) => setSortOrder(v)}
                  options={[
                    { value: 'newest', label: 'Mới nhất - cũ nhất' },
                    { value: 'oldest', label: 'Cũ nhất - mới nhất' },
                  ]}
                  suffixIcon={<Icon name={ICONS.chevronDown} size={16} color="#000" />}
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, borderRadius: 100, overflow: 'hidden' }}
                  className="you-sort-select h-[50px] w-full max-w-[302px] [&_.ant-select-selector]:!rounded-[100px] [&_.ant-select-selector]:!h-[50px] [&_.ant-select-selector]:!border-[#CDCED7] [&_.ant-select-selection-item]:!flex [&_.ant-select-selection-item]:!items-center [&_.ant-select-selection-item]:!h-full"
                />
              </div>

              {/* Cards grid — stagger fade on mount & filter change */}
              <div
                ref={cardsRef as React.RefObject<HTMLDivElement>}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10"
              >
                {filteredProjects.map((project, index) => (
                  <div
                    key={`${activeFilter}-${project.id}`}
                    className={cn(
                      cardsVisible ? 'animate-fade-in-up' : 'opacity-0'
                    )}
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <ProjectCard
                      project={project}
                      ledBy={MEMBER_MAP[project.memberId]}
                    />
                  </div>
                ))}
              </div>

              {filteredProjects.length === 0 && (
                <Empty description="No projects found for this SDG." className="py-12" />
              )}
            </div>
          </div>
        </Container>
    </div>
  );
}
