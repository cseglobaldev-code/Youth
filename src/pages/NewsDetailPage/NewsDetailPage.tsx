import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Skeleton, Tag, Button } from 'antd';
import { Container } from '@/components/ui/Container';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { BlocksRenderer } from '@/components/dynamic/BlocksRenderer';
import { CTABanner } from '@/components/shared/CTABanner';
import { ShareButton } from '@/components/shared/ShareButton/ShareButton';
import { Icon } from '@/components/ui/Icon';
import { fetchNewsById, fetchNews, type NewsItem } from '@/api/news';
import { useLanguage } from '@/context/LanguageContext';
import { updatePageSEO } from '@/lib/utils/seo';
import { ROUTES } from '@/routes/paths';

export function NewsDetailPage() {
  const { newsId } = useParams<{ newsId: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [article, setArticle] = useState<NewsItem | null>(null);
  const [related, setRelated] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!newsId) return;
    const controller = new AbortController();
    setLoading(true);

    Promise.all([
      fetchNewsById(newsId, { locale: language, signal: controller.signal }),
      fetchNews({ locale: language, signal: controller.signal }),
    ])
      .then(([current, all]) => {
        setArticle(current);
        setRelated(all.filter((item) => item.id !== newsId).slice(0, 3));
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setArticle(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [newsId, language]);

  useEffect(() => {
    if (article) {
      updatePageSEO(
        {
          metaTitle: `${article.title} · Y.O.U News`,
          metaDescription: article.excerpt,
          metaImage: article.coverUrl ? { url: article.coverUrl } : null,
        },
        article.title
      );
    }
  }, [article]);

  if (loading) {
    return (
      <Container className="py-20">
        <Skeleton active paragraph={{ rows: 10 }} />
      </Container>
    );
  }

  if (!article) {
    return (
      <Container className="py-20 text-center">
        <h2 className="text-2xl font-bold text-neutral-900">Article Not Found</h2>
        <Button onClick={() => navigate(ROUTES.NEWS)} className="mt-4">
          Back to News
        </Button>
      </Container>
    );
  }

  return (
    <div className="py-10 lg:py-16">
      <Container size="narrow">
        <Link
          to={ROUTES.NEWS}
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-[#005D9A] mb-8"
        >
          <Icon name="lucide:arrow-left" size={16} />
          Back to all stories
        </Link>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {article.category && <Tag color="blue">{article.category}</Tag>}
            {article.date && <span className="text-sm text-neutral-500">{article.date}</span>}
            <span className="text-sm text-neutral-400">·</span>
            <span className="text-sm text-neutral-600 font-medium">By {article.author}</span>
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight mb-6"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            {article.title}
          </h1>

          <p className="text-lg md:text-xl text-neutral-700 leading-relaxed font-normal italic border-l-4 border-[#005D9A] pl-4 py-1 bg-neutral-50 rounded-r-lg">
            {article.excerpt}
          </p>
        </div>

        {/* Cover Image */}
        <div className="aspect-[16/9] w-full overflow-hidden rounded-3xl mb-10 bg-neutral-100 shadow-sm">
          <ImageWithFallback
            src={article.coverUrl}
            alt={article.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="prose max-w-none text-neutral-800 leading-relaxed mb-12">
          {article.content ? (
            <BlocksRenderer content={article.content} />
          ) : (
            <p className="text-base text-neutral-700 leading-relaxed">{article.excerpt}</p>
          )}
        </div>

        {/* Share Button Section */}
        <div className="border-y border-neutral-200 py-6 mb-16 flex items-center justify-between">
          <span className="font-semibold text-neutral-800">
            {language === 'vi' ? 'Chia sẻ câu chuyện này:' : 'Share this story:'}
          </span>
          <ShareButton
            title={article.title}
            text={article.excerpt}
            variant="pill"
          />
        </div>

        {/* Related News */}
        {related.length > 0 && (
          <div className="mt-16">
            <h3
              className="text-2xl font-bold text-neutral-900 mb-6"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            >
              Related Stories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(ROUTES.NEWS_DETAIL(item.id))}
                  className="group cursor-pointer flex flex-col bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow transition"
                >
                  <div className="aspect-video w-full overflow-hidden bg-neutral-100">
                    <ImageWithFallback
                      src={item.coverUrl}
                      alt={item.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="font-bold text-neutral-900 line-clamp-2 text-sm leading-snug group-hover:text-[#005D9A]">
                      {item.title}
                    </h4>
                    <span className="text-xs text-neutral-500 mt-2">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
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