import { useState } from 'react';
import { Button, Image } from 'antd';
import { Icon } from '@/components/ui/Icon';
import { ViewAllButton } from '@/components/common/ViewAllButton';
import { ROUTES } from '@/routes/paths';

const MOCK_MEMBER = {
  name: 'YouthBridge PH',
  country: 'Philippines',
  period: '2021 → nay',
  leader: 'Maria Santos',
  tags: ['#SDG 1', '#SDG 4', '#SDG 8'],
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

function MemberCard({ member }: { member: typeof MOCK_MEMBER & { id: string } }) {
  return (
    <div className="w-[426.67px] h-[456.68px] bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col cursor-pointer transition-shadow duration-200 hover:shadow-xl">
      {/* Cover */}
      <div className="relative w-[426.67px] h-[214.68px] flex-shrink-0">
        <Image
          src={member.coverUrl}
          alt={member.name}
          preview={false}
          className="w-full h-full object-cover"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          wrapperStyle={{ width: '100%', height: '100%' }}
        />
        {/* Logo circle */}
        <div className="absolute bottom-[-40px] left-4 w-[80px] h-[80px] rounded-full border-4 border-white overflow-hidden bg-white shadow">
          <Image src={member.logoUrl} alt={`${member.name} logo`} preview={false} className="w-full h-full object-cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} wrapperStyle={{ width: '100%', height: '100%' }} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-10 px-4 pb-4 flex flex-col">
        {/* Title */}
        <h3 className="font-semibold text-[24px] text-[#111111]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          {member.name}
        </h3>

        {/* Info items */}
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-4 text-[18px] font-medium text-neutral-600" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            <span className="flex items-center gap-1">
              <Icon name="mynaui:map-pin" size={18} />
              {member.country}
            </span>
            <span className="flex items-center gap-1">
              <Icon name="iconoir:clock" size={18} />
              {member.period}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[18px] font-medium text-neutral-600" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            <Icon name="solar:user-linear" size={18} />
            {member.leader}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto pt-3">
          {member.tags.map((tag) => (
            <span
              key={tag}
              className="bg-[#E3F2FD] text-[#111111] text-[18px] font-medium px-3 py-1.5 rounded"
              style={{ fontFamily: 'Open Sans, sans-serif', padding: '6px 12px' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

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
          <MemberCard key={member.id} member={member} />
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
