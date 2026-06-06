import { useState } from 'react';
import { Button } from 'antd';
import { Icon } from '@/components/ui/Icon';
import { ViewAllButton } from '@/components/common/ViewAllButton';
import { MemberCardLarge } from '@/components/common/MemberCardLarge/MemberCardLarge';
import { ROUTES } from '@/routes/paths';

const MOCK_MEMBER = {
  name: 'YouthBridge PH',
  country: 'Philippines',
  period: '2021 → nay',
  leader: 'Maria Santos',
  focusSdgs: [1, 4, 8],
  coverUrl: '/cover-image1.png',
  logoUrl: '/small-logo1.png',
};

// Render 30 cards from mock data
const MEMBERS = Array.from({ length: 30 }, (_, i) => ({
  ...MOCK_MEMBER,
  id: `member-${i + 1}`,
  coverUrl: i % 3 === 0 ? '/cover-image1.png' : i % 3 === 1 ? '/cover-image2.png' : '/cover-image3.png',
  logoUrl: i % 3 === 0 ? '/small-logo1.png' : i % 3 === 1 ? '/small-logo2.png' : '/small-logo3.png',
  name: i % 3 === 0 ? 'YouthBridge PH' : i % 3 === 1 ? 'CSE Global' : 'Future Leaders Kenya',
}));

export function MembersSection() {
  const [page, setPage] = useState(0);
  const pageSize = 6;
  const totalPages = Math.ceil(MEMBERS.length / pageSize);
  const visibleMembers = MEMBERS.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <section className="bg-[#F2F7FF] py-[120px] px-[288px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-[40px]">
        <h2 className="font-semibold text-[48px] leading-tight" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          Member of <span className="bg-gradient-to-r from-[#E42C27] via-[#FBAB1A] to-[#10984F] bg-clip-text text-transparent">Y.O.U</span>
        </h2>
        <ViewAllButton to={ROUTES.MEMBERS} />
      </div>

      {/* Grid 3 cols × 2 rows */}
      <div className="grid grid-cols-3 gap-6">
        {visibleMembers.map((member) => (
          <MemberCardLarge
            key={member.id}
            member={{
              name: member.name,
              country: member.country,
              period: member.period || '2020 → nay',
              leader: member.leader || 'TBD',
              focusSdgs: member.focusSdgs,
              coverUrl: member.coverUrl || '',
              logoUrl: member.logoUrl,
            }}
          />
        ))}
      </div>

      {/* Pagination: arrows + page number */}
      <div className="flex justify-center items-center gap-4 mt-[40px]">
        <Button
          type="text"
          className="!w-8 !h-8 !p-0 !flex !items-center !justify-center text-neutral-500 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
          aria-label="Previous page"
        >
          <Icon name="lucide:arrow-left" size={20} />
        </Button>
        <span className="text-sm text-neutral-600 font-medium">
          {page + 1}/{totalPages}
        </span>
        <Button
          type="text"
          className="!w-8 !h-8 !p-0 !flex !items-center !justify-center text-[#EE334E] hover:text-[#d42a43] disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
          disabled={page === totalPages - 1}
          aria-label="Next page"
        >
          <Icon name="lucide:arrow-right" size={20} />
        </Button>
      </div>
    </section>
  );
}