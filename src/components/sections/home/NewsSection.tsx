// src/components/sections/home/NewsSection.tsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Image, Spin } from 'antd';
import { Icon } from '@/components/ui/Icon';
import { ViewAllButton } from '@/components/common/ViewAllButton';
import { Container } from '@/components/ui/Container';
import { ROUTES } from '@/routes/paths';
import { StrapiService } from '@/lib/strapi';
import type { Project, Member } from '@/types';

export function NewsSection() {
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileIndex, setMobileIndex] = useState(0);

  useEffect(() => {
    Promise.all([
      StrapiService.getProjects(),
      StrapiService.getMembers()
    ])
      .then(([projectData, memberData]) => {
        setProjects(projectData);
        setMembers(memberData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const memberMap = useMemo(() => {
    return Object.fromEntries(members.map((m) => [m.id, m.name]));
  }, [members]);

  const featured = projects[0];
  const sideNews = projects.slice(1, 5);

  const showPreviousNews = () => {
    setMobileIndex((current) => (current - 1 + projects.length) % projects.length);
  };

  const showNextNews = () => {
    setMobileIndex((current) => (current + 1) % projects.length);
  };

  if (loading) {
    return (
      <div className="py-20 text-center bg-white">
        <Spin size="large" tip="Đang tải các dự án..." />
      </div>
    );
  }

  if (projects.length === 0) return null;

  const mobileFeatured = projects[mobileIndex];

  return (
    <section className="bg-white py-12 md:py-16 lg:py-[120px]">
      <Container size="wide">
        <div className="mb-8 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between lg:mb-[40px]">
          <h2 className="font-semibold text-[32px] leading-none md:text-[clamp(1.5rem,3.13vw,3rem)] md:leading-tight" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            <span className="block md:inline">Impact Aligned with</span>
            <br className="md:hidden" />
            <span className="bg-gradient-to-r from-[#E42C27] via-[#FBAB1A] to-[#10984F] bg-clip-text text-transparent">
              Global Goals
            </span>
          </h2>
          <ViewAllButton to={ROUTES.PROJECTS} className="flex-shrink-0 !px-4 !py-1.5 !text-sm sm:!px-6 sm:!py-2.5 sm:!text-[16px]" />
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          <div className="flex cursor-pointer flex-col group" onClick={() => navigate(ROUTES.PROJECT_DETAIL(mobileFeatured.id))}>
            <div className="mb-4 overflow-hidden rounded-2xl aspect-[343/230]">
              <Image
                src={mobileFeatured.outstandingImageUrl}
                alt={mobileFeatured.name}
                preview={false}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                wrapperStyle={{ width: '100%', height: '100%' }}
              />
            </div>
            <h4 className="mb-3 font-semibold text-[clamp(1.5rem,6.2vw,1.75rem)] leading-tight text-[#111111]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              {mobileFeatured.name}
            </h4>
            <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[clamp(0.875rem,3.6vw,1rem)] text-neutral-500" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              <span className="flex items-center gap-1">
                <Icon name="mynaui:map-pin" size={18} />
                {mobileFeatured.region}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="solar:user-linear" size={18} />
                {memberMap[mobileFeatured.memberId] || 'TBD'}
              </span>
            </div>
            <p className="text-neutral-600 text-[clamp(0.9375rem,3.8vw,1rem)] font-normal leading-relaxed line-clamp-2" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              {mobileFeatured.description}
            </p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              type="text"
              className="!flex !h-8 !w-8 !items-center !justify-center !p-0 text-neutral-500 hover:text-neutral-900"
              onClick={showPreviousNews}
              aria-label="Previous news"
            >
              <Icon name="lucide:arrow-left" size={20} />
            </Button>
            <span className="text-sm font-medium text-neutral-600">
              {mobileIndex + 1}/{projects.length}
            </span>
            <Button
              type="text"
              className="!flex !h-8 !w-8 !items-center !justify-center !p-0 text-[#EE334E] hover:text-[#d42a43]"
              onClick={showNextNews}
              aria-label="Next news"
            >
              <Icon name="lucide:arrow-right" size={20} />
            </Button>
          </div>
        </div>

        {/* Desktop View */}
        {featured && (
          <div className="hidden md:flex flex-col gap-6 md:flex-row lg:gap-8">
            <div
              className="group flex w-full cursor-pointer flex-col md:w-1/2"
              onClick={() => navigate(ROUTES.PROJECT_DETAIL(featured.id))}
            >
              <div className="mb-4 overflow-hidden rounded-2xl aspect-[652/436]">
                <Image
                  src={featured.outstandingImageUrl}
                  alt={featured.name}
                  preview={false}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  wrapperStyle={{ width: '100%', height: '100%' }}
                />
              </div>
              <div className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-[clamp(0.875rem,1.04vw,1rem)] text-neutral-500" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                <span className="flex items-center gap-1">
                  <Icon name="mynaui:map-pin" size={18} />
                  {featured.region}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="solar:user-linear" size={18} />
                  {memberMap[featured.memberId] || 'TBD'}
                </span>
              </div>
              <p className="mb-3 text-neutral-600 text-[clamp(1rem,1.17vw,1.125rem)] font-normal leading-relaxed line-clamp-2" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                {featured.description}
              </p>
              <Button
                type="link"
                danger
                className="!flex !items-center !gap-1 !p-0 !h-auto !text-[clamp(1rem,1.17vw,1.125rem)] !font-semibold"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
                onClick={(event) => {
                  event.stopPropagation();
                  navigate(ROUTES.PROJECT_DETAIL(featured.id));
                }}
              >
                Read More
                <Icon name="solar:arrow-right-up-bold" size={16} />
              </Button>
            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-6">
              {sideNews.map((p) => (
                <div
                  key={p.id}
                  className="flex gap-4 cursor-pointer group"
                  onClick={() => navigate(ROUTES.PROJECT_DETAIL(p.id))}
                >
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={p.outstandingImageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="font-semibold text-sm sm:text-base line-clamp-1 group-hover:text-[#EE334E] transition-colors">
                      {p.name}
                    </h4>
                    <p className="text-xs text-neutral-500 line-clamp-2 mt-1">
                      {p.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}