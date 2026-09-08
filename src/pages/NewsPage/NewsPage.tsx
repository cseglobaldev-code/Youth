import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, Empty, Input, Skeleton, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Container } from '@/components/ui/Container';
import { Pagination } from '@/components/shared/Pagination';
import { CTABanner } from '@/components/shared/CTABanner';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { Icon } from '@/components/ui/Icon';
import { usePagination } from '@/hooks';
import { fetchNews, type NewsItem } from '@/api/news';
import { useLanguage } from '@/context/LanguageContext';
import { ROUTES } from '@/routes/paths';

export function NewsPage() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(searchParams.get('cat') || 'All');

  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetchNews({ locale: language, signal: controller.signal })
      .then(setNews)
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [language]);

  // Fix 1: Explicit type predicate (cat is string) so categories is strictly string[]
  const categories: string[] = useMemo(() => {
    const unique = Array.from(
      new Set(
        news
          .map((item) => item.category)
          .filter((cat): cat is string => Boolean(cat))
      )
    );
    return ['All', ...unique];
  }, [news]);

  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const matchCat = activeCategory === 'All' || item.category === activeCategory;
      const matchQuery =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [news, activeCategory, searchQuery]);

  const { pageItems, total, currentPage, pageSize, goToPage, resetPage } =
    usePagination(filteredNews, 6);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    const nextParams = new URLSearchParams(searchParams);
    if (cat === 'All') nextParams.delete('cat');
    else nextParams.set('cat', cat);
    setSearchParams(nextParams);
    resetPage();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextParams = new URLSearchParams(searchParams);
    if (!e.target.value) nextParams.delete('q');
    else nextParams.set('q', e.target.value);
    setSearchParams(nextParams);
    resetPage();
  };

  return (
    <div className="py-section-sm lg:py-section">
      <Container>
        <div className="mx-auto mb-10 flex max-w-[1120px] flex-col items-center gap-4 text-center">
          <h1
            className="font-semibold text-black text-[clamp(2.5rem,4.17vw,80px)] leading-[110%]"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            News &amp;{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, #EE334E 0%, #FCB131 33%, #00A651 67%, #0081C8 100%)',
              }}
            >
              Impact Stories
            </span>
          </h1>
          <p className="max-w-[840px] text-[clamp(1rem,1.25vw,1.375rem)] text-neutral-600">
            Read the latest updates, diplomatic summits, international memorandums, and youth-led initiatives from across the Y.O.U global alliance.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#005D9A] text-white'
                    : 'bg-[#F2F7FF] text-neutral-700 hover:bg-[#e1eeff]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <Input
            placeholder="Search stories…"
            value={searchQuery}
            onChange={handleSearch}
            suffix={<SearchOutlined className="text-neutral-400" />}
            className="h-11 w-full max-w-[320px] rounded-full border-[#D9D9D9] px-4"
          />
        </div>

        {/* News Grid */}
        {loading && news.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} active paragraph={{ rows: 4 }} />
            ))}
          </div>
        ) : error && news.length === 0 ? (
          <Alert type="error" message="Unable to load news articles from the CMS." showIcon />
        ) : pageItems.length === 0 ? (
          <Empty description="No articles found matching your criteria." className="py-16" />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {pageItems.map((item) => (
                <article
                  key={item.id}
                  onClick={() => navigate(ROUTES.NEWS_DETAIL(item.id))}
                  className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-sm transition hover:-translate-y-1 hover:shadow-md cursor-pointer"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                    <ImageWithFallback
                      src={item.coverUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-2 mb-3 text-xs text-neutral-500 font-medium">
                      {item.category && <Tag color="blue">{item.category}</Tag>}
                      {item.date && <span>{item.date}</span>}
                    </div>
                    <h2
                      className="text-xl font-bold text-neutral-900 leading-snug line-clamp-2 transition group-hover:text-[#005D9A]"
                      style={{ fontFamily: 'Open Sans, sans-serif' }}
                    >
                      {item.title}
                    </h2>
                    <p className="mt-3 text-neutral-600 text-sm leading-relaxed line-clamp-3">
                      {item.excerpt}
                    </p>
                    <div className="mt-auto pt-5 flex items-center gap-1 font-semibold text-sm text-[#EE334E] group-hover:underline">
                      {/* Fix 2: Use t.common.seeMore */}
                      {t.common.seeMore}
                      <Icon name="lucide:arrow-right" size={16} />
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="flex justify-center">
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
        title="Stay Connected with Youth-Led Impact"
        description="Subscribe and collaborate with global leaders transforming communities."
        ctaLabel="Join Y.O.U"
      />
    </div>
  );
}