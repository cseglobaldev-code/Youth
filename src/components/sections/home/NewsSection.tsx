import { Button, Image } from 'antd';
import { Icon } from '@/components/ui/Icon';
import { ViewAllButton } from '@/components/common/ViewAllButton';
import { ROUTES } from '@/routes/paths';

const NEWS_DATA = [
  {
    id: 'news-1',
    title: 'Global Diplomacy Leadership Certification',
    description: 'A world where every young person has the platform and tools to lead positive change in their community and beyond.',
    location: 'Asia, Africa',
    author: 'Maria Santos',
    period: '2021 → nay',
    imageUrl: '/image-new.png',
  },
  {
    id: 'news-2',
    title: 'ASEAN China Media Cooperation',
    description: 'The agenda included welcoming remarks, institutional presentations, discussions on future collaboration opportunities.',
    location: 'Asia, Africa',
    author: 'Maria Santos',
    imageUrl: '/image-new1.png',
  },
  {
    id: 'news-3',
    title: 'The Moon-Like Volcanic Landscape...',
    description: 'On Friday, 15 May 2026, ASEAN Youth Organization (AYO), through the implementation of the AI Ready ASEAN Program.',
    location: 'Asia, Africa',
    author: 'Maria Santos',
    imageUrl: '/image-new2.png',
  },
  {
    id: 'news-4',
    title: 'What Motivates Students to Join Or...',
    description: 'Rangsit University on 15 May 2026 to strengthen collaboration in AI literacy and youth empowerment.',
    location: 'Asia, Africa',
    author: 'Maria Santos',
    imageUrl: '/image-new3.png',
  },
  {
    id: 'news-5',
    title: 'ASEAN Youth Organization Establis...',
    description: 'ASEAN Youth Organization, through the AI Ready ASEAN program, officially signed a Memorandum of Understanding (MoU).',
    location: 'Asia, Africa',
    author: 'Maria Santos',
    imageUrl: '/image-new4.png',
  },
];

export function NewsSection() {
  const featured = NEWS_DATA[0];
  const sideNews = NEWS_DATA.slice(1);

  return (
    <section className="bg-white py-[120px] px-[288px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-[40px]">
        <h2 className="font-semibold text-[48px] leading-tight" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          Impact Aligned with{' '}
          <span className="bg-gradient-to-r from-[#E42C27] via-[#FBAB1A] to-[#10984F] bg-clip-text text-transparent">
            Global Goals
          </span>
        </h2>
        <ViewAllButton to={ROUTES.PROJECTS} />
      </div>

      {/* Content: featured left + list right */}
      <div className="flex gap-8">
        {/* Left: featured article — 50% */}
        <div className="w-1/2 flex flex-col group cursor-pointer">
          <div className="rounded-2xl overflow-hidden aspect-[652/436] mb-4">
            <Image
              src={featured.imageUrl}
              alt={featured.title}
              preview={false}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              wrapperStyle={{ width: '100%', height: '100%' }}
            />
          </div>
          {/* Meta */}
          <div className="flex items-center gap-6 text-[16px] text-neutral-500 mb-3" style={{ fontFamily: 'Open Sans, sans-serif' }}>
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
          <p className="text-neutral-600 text-[18px] font-normal leading-relaxed line-clamp-2 mb-3" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            {featured.description}
          </p>
          {/* See more */}
          <Button type="link" danger className="!flex !items-center !gap-1 !text-[18px] !font-semibold !p-0 !h-auto" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            See more
            <Icon name="lucide:arrow-up-right" size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Button>
        </div>

        {/* Right: news list — 50% */}
        <div className="w-1/2 flex flex-col gap-4">
          {sideNews.map((news) => (
            <div key={news.id} className="flex gap-4 cursor-pointer hover:bg-neutral-50 rounded-xl transition-colors p-2 group">
              <div className="w-[200px] h-[130px] flex-shrink-0 rounded-xl overflow-hidden">
                <Image src={news.imageUrl} alt={news.title} preview={false} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" style={{ width: '100%', height: '100%', objectFit: 'cover' }} wrapperStyle={{ width: '100%', height: '100%' }} />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h4 className="font-semibold text-[20px] text-[#111111] mb-1 line-clamp-1 transition-colors group-hover:text-[#EE334E]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                  {news.title}
                </h4>
                <div className="flex items-center gap-4 text-[14px] text-neutral-500" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                  <span className="flex items-center gap-1">
                    <Icon name="mynaui:map-pin" size={14} />
                    {news.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="solar:user-linear" size={14} />
                    {news.author}
                  </span>
                </div>
                <p className="text-neutral-500 text-[14px] font-normal line-clamp-2 mt-1" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                  {news.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
