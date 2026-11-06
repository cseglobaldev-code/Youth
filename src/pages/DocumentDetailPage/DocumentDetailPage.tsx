import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Spin } from 'antd';
import { Container } from '@/components/ui/Container';
import { fetchDocument } from '@/api/documents';
import { usePublishedDocuments } from '@/hooks/usePublishedDocuments';
import {
  documentCaption,
  documentEmbedUrl,
  formatDocumentDate,
  safeDocumentUrl,
} from '@/lib/utils/documentLinks';
import { ROUTES } from '@/routes/paths';
import { DocumentContent } from '@/components/documents/DocumentContent';
import type { DocumentItem } from '@/types/document';

// Strapi recreates component row IDs when publishing. Keep the selection tied
// to the historical version itself across background refreshes.
const archiveKey = (item: {
  revision: string;
  effectiveDate: string;
  url: string;
}) => `${item.revision}|${item.effectiveDate}|${item.url}`;

function DocumentView({ doc }: { doc: DocumentItem }) {
  const [selected, setSelected] = useState('current');
  const [loaded, setLoaded] = useState(false);
  const [slide, setSlide] = useState(0);
  const legal = doc.category === 'legal';
  const slides =
    doc.section === 'protocol' ||
    doc.section === 'bluebook' ||
    doc.displayMode === 'slides';
  const archive = !slides
    ? doc.archives?.find((item) => archiveKey(item) === selected)
    : undefined;
  const source =
    legal && !archive
      ? ''
      : safeDocumentUrl(archive?.url || doc.externalUrl || doc.fileUrl);
  const embed = documentEmbedUrl(
    archive?.embedUrl || archive?.url || doc.embedUrl || source,
  );
  const images = doc.slideImages || [];
  return (
    <>
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">{doc.title}</h1>
      <p className="text-neutral-500 mb-8">
        {legal
          ? `Last Updated: ${formatDocumentDate(doc.updatedAt)}`
          : documentCaption(archive || doc)}
      </p>
      {!archive && <DocumentContent blocks={doc.content || []} />}
      {legal && archive && (
        <p className="mb-6 text-neutral-500">
          Archived version: {documentCaption(archive)}
        </p>
      )}
      {(!legal || !!doc.archives?.length) && (
        <>
          {!slides && !!doc.archives?.length && (
            <div className="my-8">
              <label
                htmlFor="document-version"
                className="block font-semibold mb-2"
              >
                Archived versions
              </label>
              <select
                id="document-version"
                value={archive ? selected : 'current'}
                onChange={(event) => {
                  setSelected(event.target.value);
                  setLoaded(false);
                }}
                className="max-w-full border border-neutral-300 rounded-lg p-3 bg-white"
              >
                <option value="current">
                  Current version — {documentCaption(doc)}
                </option>
                {doc.archives.map((item) => (
                  <option key={archiveKey(item)} value={archiveKey(item)}>
                    {item.label ? `${item.label} — ` : ''}
                    {documentCaption(item)}
                  </option>
                ))}
              </select>
            </div>
          )}
          {source && (
            <a
              href={source}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-brand underline my-4"
            >
              Open {archive ? 'archived' : 'current'} document in a new tab
            </a>
          )}
          {embed && (
            <div className="mt-4">
              {loaded ? (
                <>
                  <iframe
                    src={embed}
                    title={`${doc.title} preview`}
                    className="w-full h-[70vh] min-h-96 rounded-xl border border-neutral-200"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                  <p className="text-sm text-neutral-500 mt-2">
                    If the preview is unavailable, open the document using the
                    link above.
                  </p>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setLoaded(true)}
                  className="px-5 py-3 rounded-full bg-brand text-white"
                >
                  Load {slides ? 'slideshow' : 'document preview'}
                </button>
              )}
            </div>
          )}
          {slides && images.length > 0 && (
            <div className="my-6">
              <img
                src={images[Math.min(slide, images.length - 1)].url}
                alt={
                  images[Math.min(slide, images.length - 1)].alt ||
                  `${doc.title} slide ${slide + 1}`
                }
                className="w-full max-h-[70vh] object-contain"
              />
              <div className="flex justify-between items-center gap-4 mt-4">
                <button
                  type="button"
                  disabled={slide === 0}
                  onClick={() => setSlide((value) => value - 1)}
                  className="text-brand disabled:opacity-40 p-2"
                >
                  Previous slide
                </button>
                <span>
                  {slide + 1} / {images.length}
                </span>
                <button
                  type="button"
                  disabled={slide >= images.length - 1}
                  onClick={() => setSlide((value) => value + 1)}
                  className="text-brand disabled:opacity-40 p-2"
                >
                  Next slide
                </button>
              </div>
            </div>
          )}
          {!source && !doc.content?.length && !images.length && (
            <p className="text-neutral-500 my-8">
              Document content is not available yet.
            </p>
          )}
        </>
      )}
    </>
  );
}

export function DocumentDetailPage({ slug: fixedSlug }: { slug?: string }) {
  const params = useParams();
  const slug = fixedSlug || params.slug || '';
  const { data, loading, error } = usePublishedDocuments(
    (signal) => fetchDocument(slug, { signal }),
    slug,
  );
  return (
    <div className="py-12 lg:py-20">
      <Container>
        <div className="max-w-4xl mx-auto">
          <Link
            to={ROUTES.POLICY_DOCUMENTS}
            className="inline-block text-brand mb-8"
          >
            ← Documents
          </Link>
          {loading ? (
            <Spin aria-label="Loading document" />
          ) : error ? (
            <p role="alert">
              This document is temporarily unavailable. Please try again
              shortly.
            </p>
          ) : data ? (
            <DocumentView key={data.id} doc={data} />
          ) : (
            <p>This document is not currently published.</p>
          )}
        </div>
      </Container>
    </div>
  );
}
