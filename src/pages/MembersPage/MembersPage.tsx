import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, Empty, Input, Popover, Select, Skeleton } from 'antd';
import { SearchOutlined, DownOutlined, CheckOutlined } from '@ant-design/icons';
import { Container } from '@/components/ui/Container';
import { MemberCardLarge } from '@/components/members/MemberCardLarge';
import { Pagination } from '@/components/shared/Pagination';
import { CTABanner } from '@/components/shared/CTABanner';
import { usePagination } from '@/hooks';
import { fetchMembers, type MemberListItem } from '@/api/members';
import { SDGS_DATA } from '@/data';

const SORT_OPTIONS = [
  { label: 'Newest - oldest', value: 'newest' },
  { label: 'Oldest - newest', value: 'oldest' },
];

export function MembersPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [members, setMembers] = useState<MemberListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Sync state from URL search params
  const searchQuery = searchParams.get('q') || '';
  const sortBy = searchParams.get('sort') || 'newest';
  const filterOrganization = searchParams.get('org') || undefined;
  const filterLocation = searchParams.get('loc') || undefined;
  const filterSdg = searchParams.get('sdg') ? Number(searchParams.get('sdg')) : undefined;

  const updateFilters = useCallback(
    (updates: Record<string, string | undefined>) => {
      const nextParams = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '') {
          nextParams.delete(key);
        } else {
          nextParams.set(key, value);
        }
      });
      setSearchParams(nextParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

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

  const organizationOptions = useMemo(
    () =>
      [...new Set(members.map((m) => m.name))]
        .sort((a, b) => a.localeCompare(b))
        .map((name) => ({ label: name, value: name })),
    [members]
  );

  const locationOptions = useMemo(
    () =>
      [...new Set(members.map((m) => m.country))]
        .sort((a, b) => a.localeCompare(b))
        .map((country) => ({ label: country, value: country })),
    [members]
  );

  const sdgOptions = useMemo(
    () => SDGS_DATA.map((sdg) => ({ label: `SDG ${sdg.id} – ${sdg.title}`, value: sdg.id })),
    []
  );

  const activeFilterCount = [filterOrganization, filterLocation, filterSdg].filter(
    (value) => value !== undefined
  ).length;

  const filteredMembers = useMemo(() => {
    let result = members;
    const query = searchQuery.trim().toLowerCase();

    if (query) {
      result = result.filter(
        (member) =>
          member.name.toLowerCase().includes(query) || member.country.toLowerCase().includes(query)
      );
    }

    if (filterOrganization) {
      result = result.filter((member) => member.name === filterOrganization);
    }
    if (filterLocation) {
      result = result.filter((member) => member.country === filterLocation);
    }
    if (filterSdg !== undefined) {
      result = result.filter((member) => member.focusSdgs.includes(filterSdg));
    }

    return sortBy === 'oldest' ? [...result].reverse() : result;
  }, [members, searchQuery, sortBy, filterOrganization, filterLocation, filterSdg]);

  const { pageItems, total, currentPage, pageSize, goToPage, resetPage } =
    usePagination(filteredMembers, 9);

  const retry = () => {
    setLoading(true);
    setError(false);
    setRetryCount((count) => count + 1);
  };

  const activeSortLabel =
    SORT_OPTIONS.find((option) => option.value === sortBy)?.label ?? SORT_OPTIONS[0].label;

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ q: event.target.value });
    resetPage();
  };

  const handleSortChange = (value: string) => {
    updateFilters({ sort: value });
    resetPage();
    setSortMenuOpen(false);
  };

  const handleClearFilters = () => {
    updateFilters({ org: undefined, loc: undefined, sdg: undefined });
    resetPage();
  };

  const filterMenu = (
    <div className="w-[302px] max-w-[calc(100vw-32px)] space-y-4">
      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-[#6B7280]">Organization</label>
        <Select
          allowClear
          showSearch
          placeholder="All organizations"
          value={filterOrganization}
          onChange={(value) => {
            updateFilters({ org: value });
            resetPage();
          }}
          options={organizationOptions}
          optionFilterProp="label"
          className="w-full"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-[#6B7280]">Location</label>
        <Select
          allowClear
          showSearch
          placeholder="All locations"
          value={filterLocation}
          onChange={(value) => {
            updateFilters({ loc: value });
            resetPage();
          }}
          options={locationOptions}
          optionFilterProp="label"
          className="w-full"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-[#6B7280]">SDGs</label>
        <Select
          allowClear
          showSearch
          placeholder="All SDGs"
          value={filterSdg}
          onChange={(value) => {
            updateFilters({ sdg: value ? String(value) : undefined });
            resetPage();
          }}
          options={sdgOptions}
          optionFilterProp="label"
          className="w-full"
        />
      </div>
      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={handleClearFilters}
          className="text-[13px] font-medium text-[#EE334E] hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );

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

          <Popover
            trigger="click"
            open={filterMenuOpen}
            onOpenChange={setFilterMenuOpen}
            content={filterMenu}
            placement="bottom"
            overlayClassName="member-filter-popover"
          >
            <button
              type="button"
              className="flex h-[48px] w-full items-center justify-between rounded-full border border-[#E7E7E7] bg-white px-5 text-[15px] text-[#111111] shadow-none transition hover:bg-white md:w-[302px] md:max-w-full"
            >
              <span>Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}</span>
              <DownOutlined className="text-[14px] text-[#1F2A44]" />
            </button>
          </Popover>
        </div>

        {loading && members.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }, (_, index) => (
              <Skeleton key={index} active paragraph={{ rows: 3 }} />
            ))}
          </div>
        ) : error && members.length === 0 ? (
          <Alert
            type="error"
            showIcon
            message="Unable to load members from the CMS."
            action={<button type="button" onClick={retry}>Retry</button>}
            className="my-12"
          />
        ) : pageItems.length === 0 ? (
          <Empty description="No members found for this filter." className="py-12" />
        ) : (
          <>
            <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {pageItems.map((member) => (
                <MemberCardLarge
                  key={member.id}
                  onClick={() => navigate(`/members/${member.id}`)}
                  member={{
                    name: member.name,
                    country: member.country,
                    period: member.period || '2020 → present',
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
        )}
      </Container>

      <CTABanner
        title="Ready to Make an Impact?"
        description="Join thousands of youth leaders across continents who are making a difference in their communities."
        ctaLabel="Register Now"
      />
    </div>
  );
}