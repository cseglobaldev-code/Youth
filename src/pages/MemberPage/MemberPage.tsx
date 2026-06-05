import { useState, useMemo } from 'react';
import { Empty, Button } from 'antd';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { MemberCardLarge } from '@/components/common/MemberCard';
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
          eyebrow=""
          title="Member of Organizations"
          description="Explore all organizations in the Y.O.U alliance. Each member profile highlights local leadership, mission focus, and SDG-aligned initiatives across regions."
          align="center"
        />

        <FilterTabs
          items={filterItems}
          activeKey={activeFilter}
          onChange={handleFilterChange}
          className="mb-12"
        />

        {pageItems.length === 0 ? (
          <Empty description="No members found for this filter." className="py-12" />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {pageItems.map((member) => (
                <div key={member.id} className="flex justify-center">
                  <MemberCardLarge
                    member={{
                      id: member.id,
                      name: member.name,
                      country: member.country,
                      period: member.period || '2020 → nay',
                      leader: member.leader || 'TBD',
                      focusSdgs: member.focusSdgs,
                      coverUrl: member.coverUrl || member.logoUrl || '',
                      logoUrl: member.logoUrl || '',
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center mb-12">
              <Pagination
                current={currentPage}
                total={total}
                pageSize={pageSize}
                onChange={goToPage}
              />
            </div>
          </>
        )}

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-pink-200 via-yellow-100 to-green-200 rounded-[20px] px-8 py-12 text-center">
          <h3 className="text-[32px] font-semibold text-[#111111] mb-3" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Ready to Make an Impact?
          </h3>
          <p className="text-[18px] text-neutral-600 mb-6 max-w-2xl mx-auto" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Join thousands of youth leaders across ASEAN who are making a difference in their communities.
          </p>
          <Button
            type="primary"
            size="large"
            className="bg-[#EE334E] hover:bg-[#d42a43] border-0 px-8 py-6 text-[16px] font-semibold rounded-full"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            Register Now
          </Button>
        </div>
      </Container>
    </div>
  );
}
