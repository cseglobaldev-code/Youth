import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Skeleton } from 'antd';
import { Icon } from '@/components/ui/Icon';
import { ViewAllButton } from '@/components/shared/ViewAllButton';
import { MemberCardLarge } from '@/components/members/MemberCardLarge';
import { Container } from '@/components/ui/Container';
import { ROUTES } from '@/routes/paths';
import { useMediaQuery } from '@/hooks';
import { fetchMembers, type MemberListItem } from '@/api/members';

export function MembersSection() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [page, setPage] = useState(0);
  const [members, setMembers] = useState<MemberListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const pageSize = isMobile ? 3 : 6;
  const totalPages = Math.ceil(members.length / pageSize);
  const currentPage = Math.min(page, Math.max(totalPages - 1, 0));
  const visibleMembers = members.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  useEffect(() => {
    const controller = new AbortController();

    fetchMembers({ signal: controller.signal })
      .then(setMembers)
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        console.error('Failed to load members', err);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return (
    <section className="bg-[#F2F7FF] rounded-t-3xl py-12 md:py-16 lg:rounded-t-[40px] lg:py-[7.5rem]">
      <Container className="max-w-[95%] sm:max-w-[85%]">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-8 lg:mb-[40px]">
          <h2 className="font-semibold text-[clamp(2rem,3.13vw,3rem)] leading-tight" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Member of <span className="bg-gradient-to-r from-[#E42C27] via-[#FBAB1A] to-[#10984F] bg-clip-text text-transparent">Y.O.U</span>
          </h2>
          <ViewAllButton to={ROUTES.MEMBERS} className="flex-shrink-0 !px-4 !py-1.5 !text-sm sm:!px-6 sm:!py-2.5 sm:!text-[16px]" />
        </div>

        {/* Grid: mobile 1 column, tablet 2 columns, desktop 3 columns; max 3 rows per page */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {loading ? (
            Array.from({ length: pageSize }, (_, i) => (
              <Skeleton key={i} active paragraph={{ rows: 3 }} />
            ))
          ) : (
            visibleMembers.map((member) => (
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
                onClick={() => navigate(ROUTES.MEMBER_DETAIL(member.id))}
              />
            ))
          )}
        </div>

        {/* Pagination: arrows + page number */}
        {!loading && (
          <div className="flex justify-center items-center gap-4 mt-8 lg:mt-[40px]">
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
        )}
      </Container>
    </section>
  );
}
