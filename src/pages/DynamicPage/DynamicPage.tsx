import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Skeleton } from 'antd';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { BlockRenderer } from '@/components/dynamic';
import { fetchPageBySlugOrId } from '@/api/pages';
import { NotFoundPage } from '@/pages/NotFoundPage';
import type { PageDetailItem } from '@/types';

export function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === '1';

  const [page, setPage] = useState<PageDetailItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const controller = new AbortController();
    setLoading(true);
    setError(false);

    fetchPageBySlugOrId(slug, {
      signal: controller.signal,
      bypassCache: isPreview,
    })
      .then((data) => {
        setPage(data);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        console.error('Failed to load dynamic page:', err);
        setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [slug, isPreview]);

  // Cập nhật SEO Title động
  useEffect(() => {
    if (page?.title) {
      document.title = page.seo?.metaTitle || `${page.title} · Y.O.U`;
    }
  }, [page]);

  if (loading) {
    return (
      <Container className="py-20">
        <Skeleton active paragraph={{ rows: 10 }} />
      </Container>
    );
  }

  if (error || !page) {
    return <NotFoundPage />;
  }

  return (
    <div className="relative w-full">
      {/* Huy hiệu cảnh báo khi đang ở chế độ xem trước (Preview Mode) */}
      {isPreview && (
        <div className="sticky top-[clamp(3.75rem,5.5vw,5.25rem)] z-40 flex items-center justify-between bg-amber-500 px-4 py-2 text-white shadow-md">
          <div className="mx-auto flex items-center gap-2 text-sm font-medium">
            <Icon name="lucide:eye" size={16} />
            <span>
              <strong>Preview Mode:</strong> You are viewing a draft version of this page.
            </span>
          </div>
        </div>
      )}

      {/* Render toàn bộ mảng dynamic blocks */}
      <BlockRenderer blocks={page.contentBlocks} />
    </div>
  );
}