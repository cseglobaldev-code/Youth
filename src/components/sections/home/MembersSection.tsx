// src/components/sections/home/MembersSection.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spin } from 'antd';
import { Icon } from '@/components/ui/Icon';
import { ViewAllButton } from '@/components/common/ViewAllButton';
import { MemberCardLarge } from '@/components/common/MemberCardLarge/MemberCardLarge';
import { Container } from '@/components/ui/Container';
import { ROUTES } from '@/routes/paths';
import { useMediaQuery } from '@/hooks';
import { StrapiService } from '@/lib/strapi';
import type { Member } from '@/types';

export function MembersSection() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 767px)');
  
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const pageSize = isMobile ? 3 : 6;
  const totalPages = Math.ceil(members.length / pageSize) || 1;
  const visibleMembers = members.slice(page * pageSize, (page + 1) * pageSize);

  useEffect(() => {
    StrapiService.getMembers()
      .then((data) => {
        setMembers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setPage(0);
  }, [pageSize]);

  if (loading) {
    return (
      <div className="bg-[#F2F7FF] py-20 text-center">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (members.length === 0) return null;

  return (
    <section className="bg-[#F2F7FF] py-12 md:py-16 lg:py-[120px]">
      <Container size="wide">
        <div className="flex items-center justify-between gap-3 mb-8 lg:mb-[40px]">
          <h2 className="font-semibold text-[clamp(1.5rem,3.13vw,3rem)] leading-tight" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Member of <span className="bg-gradient-to-r from-[#E42C27] via-[#FBAB1A] to-[#10984F] bg-clip-text text-transparent">Y.O.U</span>
          </h2>
          <ViewAllButton to={ROUTES.MEMBERS} className="flex-shrink-0 !px-4 !py-1.5 !text-sm sm:!px-6 sm:!py-2.5 sm:!text-[16px]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
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
              onClick={() => navigate(ROUTES.MEMBER_DETAIL(member.id))}
            />
          ))}
        </div>

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
      </Container>
    </section>
  );
}