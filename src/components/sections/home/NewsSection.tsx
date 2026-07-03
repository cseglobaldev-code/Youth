import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Image } from 'antd';
import { Icon } from '@/components/ui/Icon';
import { ViewAllButton } from '@/components/common/ViewAllButton';
import { Container } from '@/components/ui/Container';
import { ROUTES } from '@/routes/paths';

const NEWS_DATA = [
  {
    id: 'project-1',
    title: 'Global Diplomacy Leadership Certification',
    description: 'A world where every young person has the platform and tools to lead positive change in their community and beyond.',
    location: 'Asia, Africa',
    author: 'Maria Santos',
    period: '2021 → nay',
    imageUrl: '/images/home/news/image-new.png',
  },
  {
    id: 'project-2',
    title: 'ASEAN China Media Cooperation',
    description: 'The agenda included welcoming remarks, institutional presentations, discussions on future collaboration opportunities.',
    location: 'Asia, Africa',
    author: 'Maria Santos',
    imageUrl: '/images/home/news/image-new1.png',
  },
  {
    id: 'project-3',
    title: 'The Moon-Like Volcanic Landscape...',
    description: 'On Friday, 15 May 2026, ASEAN Youth Organization (AYO), through the implementation of the AI Ready ASEAN Program.',
    location: 'Asia, Africa',
    author: 'Maria Santos',
    imageUrl: '/images/home/news/image-new2.png',
  },
  {
    id: 'project-4',
    title: 'What Motivates Students to Join Or...',
    description: 'Rangsit University on 15 May 2026 to strengthen collaboration in AI literacy and youth empowerment.',
    location: 'Asia, Africa',
    author: 'Maria Santos',
    imageUrl: '/images/home/news/image-new3.png',
  },
  {
    id: 'project-5',
    title: 'ASEAN Youth Organization Establis...',
    description: 'ASEAN Youth Organization, through the AI Ready ASEAN program, officially signed a Memorandum of Understanding (MoU).',
    location: 'Asia, Africa',
    author: 'Maria Santos',
    imageUrl: '/images/home/news/image-new4.png',
  },
];

const MOBILE_NEWS_DATA = [
  NEWS_DATA[1],
  NEWS_DATA[2],
  NEWS_DATA[3],
  NEWS_DATA[0],
  NEWS_DATA[4],
  NEWS_DATA[1],
  NEWS_DATA[2],
  NEWS_DATA[3],
  NEWS_DATA[0],
  NEWS_DATA[4],
];

export function NewsSection() {
  const navigate = useNavigate();
  const [mobileIndex, setMobileIndex] = useState(3);
  const featured = NEWS_DATA[0];
  const sideNews = NEWS_DATA.slice(1);
  const mobileFeatured = MOBILE_NEWS_DATA[mobileIndex];

  const showPreviousNews = () => {
    setMobileIndex((current) => (current - 1 + MOBILE_NEWS_DATA.length) % MOBILE_NEWS_DATA.length);
  };

  const showNextNews = () => {
    setMobileIndex((current) => (current + 1) % MOBILE_NEWS_DATA.length);
  };

  return (
    <section className="bg-white py-12 md:py-16 lg:py-[120px]">
      <Container size="wide">
        {/* Header */}
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

        {/* Mobile: single card + pager */}
        <div className="md:hidden">
          <div className="flex cursor-pointer flex-col group" onClick={() => navigate(ROUTES.PROJECT_DETAIL(mobileFeatured.id))}>
            <div className="mb-4 overflow-hidden rounded-2xl aspect-[343/230]">
              <Image
                src={mobileFeatured.imageUrl}
                alt={mobileFeatured.title}
                preview={false}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                wrapperStyle={{ width: '100%', height: '100%' }}
              />
            </div>
            <h4 className="mb-3 font-semibold text-[clamp(1.5rem,6.2vw,1.75rem)] leading-tight text-[#111111]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              {mobileFeatured.title}
            </h4>
            <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[clamp(0.875rem,3.6vw,1rem)] text-neutral-500" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              <span className="flex items-center gap-1">
                <Icon name="mynaui:map-pin" size={18} />
                {mobileFeatured.location}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="solar:user-linear" size={18} />
                {mobileFeatured.author}
              </span>
              {mobileFeatured.period && (
                <span className="flex items-center gap-1">
                  <Icon name="iconoir:clock" size={18} />
                  {mobileFeatured.period}
                </span>
              )}
            </div>
            <p className="text-neutral-600 text-[clamp(0.9375rem,3.8vw,1rem)] font-normal leading-relaxed line-clamp-2" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              {mobileFeatured.description}
            </p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              type="text"
              className="!flex !h-8 !w-8 !items-center !justify-center !p-0 text-neutral-500 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-30"
              onClick={showPreviousNews}
              aria-label="Previous news"
            >
              <Icon name="lucide:arrow-left" size={20} />
            </Button>
            <span className="text-sm font-medium text-neutral-600">
              {mobileIndex + 1}/{MOBILE_NEWS_DATA.length}
            </span>
            <Button
              type="text"
              className="!flex !h-8 !w-8 !items-center !justify-center !p-0 text-[#EE334E] hover:text-[#d42a43] disabled:cursor-not-allowed disabled:opacity-30"
              onClick={showNextNews}
              aria-label="Next news"
            >
              <Icon name="lucide:arrow-right" size={20} />
            </Button>
          </div>
        </div>

        {/* Desktop/tablet: featured left + list right */}
        <div className="hidden md:flex flex-col gap-6 md:flex-row lg:gap-8">
          {/* Left: featured article */}
          <div
            className="group flex w-full cursor-pointer flex-col md:w-1/2"
            onClick={() => navigate(ROUTES.PROJECT_DETAIL(featured.id))}
          >
            <div className="mb-4 overflow-hidden rounded-2xl aspect-[652/436]">
              <Image
                src={featured.imageUrl}
                alt={featured.title}
                preview={false}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                wrapperStyle={{ width: '100%', height: '100%' }}
              />
            </div>
            {/* Meta */}
            <div className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-[clamp(0.875rem,1.04vw,1rem)] text-neutral-500" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              <span className="flex items-center gap-1">
                <Icon name="mynaui:map-pin" size={18} />
                {featured.location}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="solar:user-linear" size={18} />
                {featured.author}
              </span>
              {featured.period && (
                <span className="flex items-center gap-1">
                  <Icon name="iconoir:clock" size={18} />
                  {featured.period}
                </span>
              )}
            </div>
            {/* Description */}
            <p className="mb-3 text-neutral-600 text-[clamp(1rem,1.17vw,1.125rem)] font-normal leading-relaxed line-clamp-2" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              {featured.description}
            </p>
            {/* See more */}
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
              See more
              <Icon name="lucide:arrow-up-right" size={18} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Right: news list */}
          <div className="hidden w-full md:flex md:w-1/2 md:flex-col gap-3 lg:gap-4">
            {sideNews.map((news) => (
              <div
                key={news.id}
                className="group flex cursor-pointer flex-row gap-3 rounded-xl p-2 transition-colors hover:bg-neutral-50 lg:gap-4"
                onClick={() => navigate(ROUTES.PROJECT_DETAIL(news.id))}
              >
                <div className="h-[72px] w-[96px] flex-shrink-0 overflow-hidden rounded-xl sm:h-[96px] sm:w-[140px] lg:h-[130px] lg:w-[200px]">
                  <Image src={news.imageUrl} alt={news.title} preview={false} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" style={{ width: '100%', height: '100%', objectFit: 'cover' }} wrapperStyle={{ width: '100%', height: '100%' }} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <h4 className="mb-1 line-clamp-1 font-semibold text-[clamp(0.875rem,1.30vw,1.25rem)] text-[#111111] transition-colors group-hover:text-[#EE334E]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                    {news.title}
                  </h4>
                  <div className="hidden flex-wrap items-center gap-x-4 gap-y-1 text-[clamp(0.8125rem,0.91vw,0.875rem)] text-neutral-500 sm:flex" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                    <span className="flex items-center gap-1">
                      <Icon name="mynaui:map-pin" size={14} />
                      {news.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="solar:user-linear" size={14} />
                      {news.author}
                    </span>
                  </div>
                  <p className="mt-1 hidden text-neutral-500 text-[clamp(0.8125rem,0.91vw,0.875rem)] font-normal line-clamp-2 sm:block" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                    {news.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
