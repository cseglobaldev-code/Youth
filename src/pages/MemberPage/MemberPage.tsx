import { useState, useMemo } from 'react';
import { Empty, Input, Popover } from 'antd';
import { SearchOutlined, DownOutlined, CheckOutlined } from '@ant-design/icons';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { MemberCardLarge } from '@/components/common/MemberCardLarge/MemberCardLarge';
import { Pagination } from '@/components/common/Pagination';
import { CTABanner } from '@/components/common/CTABanner';
import { usePagination } from '@/hooks';


const MOCK_MEMBER = {
  name: 'YouthBridge PH',
  country: 'Philippines',
  period: '2021 → nay',
  leader: 'Maria Santos',
  focusSdgs: [1, 4, 8],
  coverUrl: '/cover-image1.png',
  logoUrl: '/small-logo1.png',
};

const MOCK_MEMBERS = Array.from({ length: 30 }, (_, i) => ({
  ...MOCK_MEMBER,
  id: `member-${i + 1}`,
  coverUrl: i % 3 === 0 ? '/cover-image1.png' : i % 3 === 1 ? '/cover-image2.png' : '/cover-image3.png',
  logoUrl: i % 3 === 0 ? '/small-logo1.png' : i % 3 === 1 ? '/small-logo2.png' : '/small-logo3.png',
  name: i % 3 === 0 ? 'YouthBridge PH' : i % 3 === 1 ? 'CSE Global' : 'Future Leaders Kenya',
}));

const SORT_OPTIONS = [
  { label: 'Mới nhất - cũ nhất', value: 'newest' },
  { label: 'Cũ nhất - mới nhất', value: 'oldest' },
  { label: 'Đơn vị tổ chức, cung cấp', value: 'organization' },
  { label: 'Địa điểm', value: 'location' },
  { label: 'SDG', value: 'sdg' },
  { label: 'Cơ hội', value: 'opportunity' },
  { label: 'Được xem nhiều nhất', value: 'mostViewed' },
  { label: 'Được yêu thích nhất', value: 'mostLiked' },
];

export function MemberPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const filteredMembers = useMemo(() => {
    let result = MOCK_MEMBERS;

    if (searchQuery.trim()) {
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'oldest':
        return [...result].reverse();
      case 'location':
        return [...result].sort((a, b) => a.country.localeCompare(b.country));
      case 'mostViewed':
        return [...result].sort((a, b) => b.id.localeCompare(a.id));
      case 'mostLiked':
        return [...result].sort((a, b) => a.id.localeCompare(b.id));
      default:
        return result;
    }
  }, [searchQuery, sortBy]);

  const { pageItems, total, currentPage, pageSize, goToPage, resetPage } =
    usePagination(filteredMembers, 9);

  const activeSortLabel =
    SORT_OPTIONS.find((option) => option.value === sortBy)?.label ?? SORT_OPTIONS[0].label;

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    resetPage();
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    resetPage();
    setSortMenuOpen(false);
  };

  const sortMenu = (
    <div className="w-[304px] rounded-[10px] bg-white p-[14px] shadow-[0_18px_36px_rgba(0,0,0,0.18)]">
      <div className="space-y-[8px]">
        {SORT_OPTIONS.map((option) => {
          const isActive = option.value === sortBy;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSortChange(option.value)}
              className={[
                'flex w-full items-center justify-between rounded-[8px] px-[10px] py-[8px] text-left text-[15px] font-normal leading-[1.3] transition',
                isActive ? 'bg-[#FCEBED] text-[#111111]' : 'bg-transparent text-[#111111] hover:bg-[#F8F8F8]',
              ].join(' ')}
            >
              <span>{option.label}</span>
              <span
                className={[
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border text-[11px]',
                  isActive
                    ? 'border-[#FF4B63] bg-[#FF4B63] text-white'
                    : 'border-[#D7DEEA] bg-white text-transparent',
                ].join(' ')}
              >
                <CheckOutlined />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="py-section-sm lg:py-section">
      <Container>
        <SectionHeading
          eyebrow=""
          title="Member of Organizations"
          description="Explore all organizations in the Y.O.U alliance. Each member profile highlights local leadership, mission focus, and SDG-aligned initiatives across regions."
          align="center"
        />

        <div className="mb-12 flex flex-col items-start gap-4 md:flex-row md:items-center">
          <Input
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Từ khóa"
            suffix={<SearchOutlined className="text-[18px] text-[#1F2A44]" />}
            className="h-[48px] w-full max-w-[302px] rounded-full border border-[#E7E7E7] bg-white px-4 shadow-none [&_.ant-input]:text-[15px] [&_.ant-input]:text-[#111111] [&_.ant-input::placeholder]:text-[#B7B7B7] [&_.ant-input-suffix]:ml-3"
          />

          <Popover
            trigger="click"
            open={sortMenuOpen}
            onOpenChange={setSortMenuOpen}
            content={sortMenu}
            placement="bottomLeft"
            overlayClassName="member-sort-popover"
          >
            <button
              type="button"
              className="flex h-[48px] w-full max-w-[302px] items-center justify-between rounded-full border border-[#E7E7E7] bg-white px-5 text-[15px] text-[#111111] shadow-none transition hover:bg-white"
            >
              <span>{activeSortLabel}</span>
              <DownOutlined className="text-[14px] text-[#1F2A44]" />
            </button>
          </Popover>
        </div>

        {pageItems.length === 0 ? (
          <Empty description="No members found for this filter." className="py-12" />
        ) : (
          <>
            <div className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((member) => (
                <div key={member.id} className="flex justify-center">
                  <MemberCardLarge
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
                </div>
              ))}
            </div>

            <div className="mb-12 flex justify-center">
              <Pagination
                current={currentPage}
                total={total}
                pageSize={pageSize}
                onChange={goToPage}
              />
            </div>
          </>
        )}
      </Container>

      <CTABanner
        title="Ready to Make an Impact?"
        description="Join thousands of youth leaders across ASEAN who are making a difference in their communities."
        ctaLabel="Register Now"
      />
    </div>
  );
}
