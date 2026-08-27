import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Empty, Input, Popover, Skeleton } from 'antd';
import { SearchOutlined, DownOutlined, CheckOutlined } from '@ant-design/icons';
import { Container } from '@/components/ui/Container';
import { MemberCardLarge } from '@/components/members/MemberCardLarge';
import { Pagination } from '@/components/shared/Pagination';
import { CTABanner } from '@/components/shared/CTABanner';
import { usePagination } from '@/hooks';
import { fetchMembers, type MemberListItem } from '@/api/members';

const SORT_OPTIONS = [
  { label: 'Newest - oldest', value: 'newest' },
  { label: 'Oldest - newest', value: 'oldest' },
  { label: 'Organization', value: 'organization' },
  { label: 'Location', value: 'location' },
  { label: 'SDG', value: 'sdg' },
  { label: 'Opportunity', value: 'opportunity' },
  { label: 'Most viewed', value: 'mostViewed' },
];

export function MembersPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [members, setMembers] = useState<MemberListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetchMembers({ signal: controller.signal })
      .then(setMembers)
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
        console.error('Failed to load members from CMS', requestError);
        setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [retryCount]);

  const filteredMembers = useMemo(() => {
    let result = members;
    const query = searchQuery.trim().toLowerCase();

    if (query) {
      result = result.filter(
        (member) =>
          member.name.toLowerCase().includes(query) || member.country.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case 'oldest':
        return [...result].reverse();
      case 'location':
        return [...result].sort((a, b) => a.country.localeCompare(b.country));
      case 'mostViewed':
        return [...result].sort((a, b) => b.id.localeCompare(a.id));
      default:
        return result;
    }
  }, [members, searchQuery, sortBy]);

  const { pageItems, total, currentPage, pageSize, goToPage, resetPage } =
    usePagination(filteredMembers, 9);

  const retry = () => {
    setLoading(true);
    setError(false);
    setRetryCount((count) => count + 1);
  };

  const renderContent = () => {
    if (loading && members.length === 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 9 }, (_, index) => (
            <Skeleton key={index} active paragraph={{ rows: 3 }} />
          ))}
        </div>
      );
    }

    if (error && members.length === 0) {
      return (
        <Alert
          type="error"
          showIcon
          message="Unable to load members from the CMS."
          action={<button type="button" onClick={retry}>Retry</button>}
          className="my-12"
        />
      );
    }

    if (pageItems.length === 0) {
      return <Empty description="No members found for this filter." className="py-12" />;
    }

    return (
      <>
        <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pageItems.map((member) => (
            <MemberCardLarge
              key={member.id}
              onClick={() => navigate(`/members/${member.id}`)}
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

        <div className="mb-12 flex justify-center">
          <Pagination current={currentPage} total={total} pageSize={pageSize} onChange={goToPage} />
        </div>
      </>
    );
  };

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
    <div className="w-[302px] max-w-[calc(100vw-32px)] bg-transparent p-0 shadow-none">
      <div className="space-y-[13px]">
        {SORT_OPTIONS.map((option) => {
          const isActive = option.value === sortBy;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSortChange(option.value)}
              className={[
                'flex h-[39px] w-full items-center justify-between rounded-[8px] px-2 text-left text-[15px] font-normal leading-none transition',
                isActive ? 'bg-[#FCE7EA] text-[#111111]' : 'bg-white text-[#111111] hover:bg-[#F8F8F8]',
              ].join(' ')}
            >
              <span>{option.label}</span>
              <span
                className={[
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border text-[10px]',
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
        <div className="mx-auto mb-10 flex max-w-[1120px] flex-col items-center gap-4 lg:gap-[24px] text-center">
          <h2
            className="font-semibold text-black"
            style={{
              fontSize: 'clamp(2.5rem, 4.17vw, 80px)',
              lineHeight: '110%',
              fontFamily: 'Open Sans, sans-serif',
            }}
          >
            Member of{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, #EE334E 0%, #FCB131 33%, #00A651 67%, #0081C8 100%)',
              }}
            >
              Organizations
            </span>
          </h2>
          <p className="text-center text-[clamp(0.9375rem,1.35vw,1.625rem)] leading-[140%] text-black">
            Explore all organizations in the Y.O.U alliance. Each member profile highlights local leadership, mission focus, and SDG-aligned initiatives across regions.
          </p>
        </div>

        <div className="mb-12 flex flex-col items-stretch gap-4 md:flex-row md:items-center">
          <Input
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Keyword"
            suffix={<SearchOutlined className="text-[18px] text-[#1F2A44]" />}
            className="h-[48px] w-full rounded-full border border-[#E7E7E7] bg-white px-4 shadow-none md:w-[302px] md:max-w-full [&_.ant-input]:text-[15px] [&_.ant-input]:text-[#111111] [&_.ant-input::placeholder]:text-[#B7B7B7] [&_.ant-input-suffix]:ml-3"
          />

          <Popover
            trigger="click"
            open={sortMenuOpen}
            onOpenChange={setSortMenuOpen}
            content={sortMenu}
            placement="bottom"
            overlayClassName="member-sort-popover"
          >
            <button
              type="button"
              className="flex h-[48px] w-full items-center justify-between rounded-full border border-[#E7E7E7] bg-white px-5 text-[15px] text-[#111111] shadow-none transition hover:bg-white md:w-[302px] md:max-w-full"
            >
              <span>{activeSortLabel}</span>
              <DownOutlined className="text-[14px] text-[#1F2A44]" />
            </button>
          </Popover>
        </div>

        {renderContent()}
      </Container>

      <CTABanner
        title="Ready to Make an Impact?"
        description="Join thousands of youth leaders across ASEAN who are making a difference in their communities."
        ctaLabel="Register Now"
      />
    </div>
  );
}
