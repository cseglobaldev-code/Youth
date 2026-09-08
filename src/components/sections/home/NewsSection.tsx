import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Skeleton } from 'antd';
import { Icon } from '@/components/ui/Icon';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { ViewAllButton } from '@/components/shared/ViewAllButton';
import { Container } from '@/components/ui/Container';
import { ROUTES } from '@/routes/paths';
import { fetchNews, type NewsItem } from '@/api/news';
import { useLanguage } from '@/context/LanguageContext';

export function NewsSection() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileIndex, setMobileIndex] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetchNews({ locale: language, signal: controller.signal })
      .then((items) => {
        setNewsData(items);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setNewsData([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [language]);

  if (!loading && newsData.length === 0) return null;

  const displayData = newsData;
  const featured = displayData[0];
  const sideNews = displayData.slice(1, 5);

  const showPreviousNews = () => {
    setMobileIndex((current) => (current - 1 + displayData.length) % displayData.length);
  };

  const showNextNews = () => {
    setMobileIndex((current) => (current + 1) % displayData.length);
  };

  const mobileFeatured = displayData[mobileIndex % displayData.length];

  return (
    <section className="bg-white py-0 pt-[120px] pb-[120px]">
      <Container className="max-w-[95%] sm:max-w-[85%]">
        <div className="mb-8 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between lg:mb-[40px]">
          <h2 className="font-semibold text-[32px] leading-none md:text-[clamp(2rem,3.13vw,3rem)] md:leading-tight" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            <span className="block md:inline">Impact Aligned with{' '}</span>
            <span className="bg-gradient-to-r from-[#EE334E] via-[#FBAB1A] to-[#10984F] bg-clip-text text-transparent">
              Global Goals
            </span>
          </h2>
          <ViewAllButton to={ROUTES.NEWS} className="flex-shrink-0 !px-4 !py-1.5 !text-sm sm:!px-6 sm:!py-2.5 sm:!text-[16px]" />
        </div>

        {loading && displayData.length === 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} active paragraph={{ rows: 3 }} />
            ))}
          </div>
        ) : (
          <>
            {/* Mobile Pager */}
            {mobileFeatured && (
              <div className="md:hidden">
                <div
                  className="flex cursor-pointer flex-col group"
                  onClick={() => navigate(ROUTES.NEWS_DETAIL(mobileFeatured.id))}
                >
                  <div className="mb-4 overflow-hidden rounded-2xl aspect-[343/230]">
                    <ImageWithFallback
                      src={mobileFeatured.coverUrl}
                      alt={mobileFeatured.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
                    {mobileFeatured.date && (
                      <span className="flex items-center gap-1">
                        <Icon name="iconoir:clock" size={18} />
                        {mobileFeatured.date}
                      </span>
                    )}
                  </div>
                  <p className="text-neutral-600 text-[clamp(0.9375rem,3.8vw,1rem)] font-normal leading-relaxed line-clamp-2" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                    {mobileFeatured.excerpt}
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
                    {mobileIndex + 1}/{displayData.length}
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
            )}

            {/* Desktop View */}
            {featured && (
              <div className="hidden md:flex flex-col gap-6 md:flex-row lg:gap-8">
                <div
                  className="group flex w-full cursor-pointer flex-col md:w-1/2"
                  onClick={() => navigate(ROUTES.NEWS_DETAIL(featured.id))}
                >
                  <div className="mb-4 overflow-hidden rounded-2xl aspect-[652/436]">
                    <ImageWithFallback
                      src={featured.coverUrl}
                      alt={featured.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-[clamp(0.875rem,1.04vw,1rem)] text-neutral-500" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                    <span className="flex items-center gap-1">
                      <Icon name="mynaui:map-pin" size={18} />
                      {featured.location}
                    </span>
                    {featured.date && (
                      <span className="flex items-center gap-1">
                        <Icon name="iconoir:clock" size={18} />
                        {featured.date}
                      </span>
                    )}
                  </div>
                  <h4 className="mb-3 font-semibold text-[clamp(1.5rem,2.08vw,2rem)] leading-tight text-[#111111]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                    {featured.title}
                  </h4>
                  <p className="mb-3 text-neutral-600 text-[clamp(1rem,1.17vw,1.125rem)] font-normal leading-relaxed line-clamp-2" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                    {featured.excerpt}
                  </p>
                  <Button
                    type="link"
                    danger
                    className="!flex self-start !justify-start !items-center !gap-1 !h-auto !p-0 !text-[20px] !leading-none !tracking-[0px] !font-semibold"
                    style={{ fontFamily: 'Open Sans, sans-serif' }}
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(ROUTES.NEWS_DETAIL(featured.id));
                    }}
                  >
                    Read article
                    <Icon name="lucide:arrow-up-right" size={18} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </Button>
                </div>

                <div className="hidden w-full md:flex md:w-1/2 md:flex-col gap-3 lg:gap-4">
                  {sideNews.map((item) => (
                    <div
                      key={item.id}
                      className="group flex cursor-pointer flex-row gap-3 rounded-xl p-2 transition-colors hover:bg-neutral-50 lg:gap-4"
                      onClick={() => navigate(ROUTES.NEWS_DETAIL(item.id))}
                    >
                      <div className="h-[72px] w-[96px] flex-shrink-0 overflow-hidden rounded-xl sm:h-[96px] sm:w-[140px] lg:h-[130px] lg:w-[200px]">
                        <ImageWithFallback src={item.coverUrl} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-center">
                        <h4 className="mb-1 line-clamp-1 font-semibold text-[clamp(0.875rem,1.30vw,1.25rem)] text-[#111111] transition-colors group-hover:text-[#EE334E]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                          {item.title}
                        </h4>
                        <div className="hidden flex-wrap items-center gap-x-4 gap-y-1 text-[clamp(0.8125rem,0.91vw,0.875rem)] text-neutral-500 sm:flex" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                          <span className="flex items-center gap-1">
                            <Icon name="mynaui:map-pin" size={14} />
                            {item.location}
                          </span>
                          {item.date && (
                            <span className="flex items-center gap-1">
                              <Icon name="iconoir:clock" size={14} />
                              {item.date}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 hidden text-neutral-500 text-[clamp(0.8125rem,0.91vw,0.875rem)] font-normal line-clamp-2 sm:block" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                          {item.excerpt}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  );
}