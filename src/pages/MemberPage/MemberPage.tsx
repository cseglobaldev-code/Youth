import { useState, useMemo } from 'react';
import { Empty } from 'antd';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { MemberCard } from '@/components/common/MemberCard';
import { FilterTabs } from '@/components/common/FilterTabs';
import { Pagination } from '@/components/common/Pagination';
import { usePagination } from '@/hooks';
import { filterBySdg } from '@/lib/utils';
import { MEMBERS_DATA, SDGS_DATA } from '@/data';

export function MemberPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filterItems = useMemo(
    () => [
      { key: 'all', label: 'All' },
      ...SDGS_DATA.filter((sdg) => MEMBERS_DATA.some((m) => m.focusSdgs.includes(sdg.id))).map(
        (sdg) => ({ key: `sdg-${sdg.id}`, label: sdg.code })
      ),
    ],
    []
  );

  const filteredMembers = useMemo(
    () => filterBySdg(MEMBERS_DATA, activeFilter),
    [activeFilter]
  );

  const { pageItems, total, currentPage, pageSize, goToPage, resetPage } =
    usePagination(filteredMembers, 9);

  const handleFilterChange = (key: string) => {
    setActiveFilter(key);
    resetPage();
  };

  return (
    <div className="py-section-sm lg:py-section">
      <Container>
        <SectionHeading
          eyebrow="Our Network"
          title="Member Organizations"
          description="Discover youth-led organizations making an impact worldwide."
        />

        <FilterTabs
          items={filterItems}
          activeKey={activeFilter}
          onChange={handleFilterChange}
          className="mb-8"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pageItems.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>

        {pageItems.length === 0 && (
          <Empty description="No members found for this filter." className="py-12" />
        )}

        <Pagination
          current={currentPage}
          total={total}
          pageSize={pageSize}
          onChange={goToPage}
        />
      </Container>
    </div>
  );
}
