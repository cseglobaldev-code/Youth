import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Spin } from 'antd';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { DocumentRow } from '@/components/documents/DocumentRow';
import { fetchDocuments } from '@/api/documents';
import { usePublishedDocuments } from '@/hooks/usePublishedDocuments';
import { DOCUMENT_CATALOG, CAREER_CONTINENTS } from '@/data/documentCatalog';
import { documentCaption } from '@/lib/utils/documentLinks';
import { ROUTES } from '@/routes/paths';
import type { DocCategory, DocumentItem } from '@/types';

const CATEGORIES = [
  { key: 'governance', label: 'Governance Documents' },
  { key: 'membership', label: 'Membership Documents' },
  { key: 'annual-reports', label: 'Annual Reports' },
] as const;
const EmptySection = () => (
  <p className="py-3 text-sm text-neutral-500">
    No published documents available yet.
  </p>
);

export function PolicyDocumentsPage() {
  const [active, setActive] = useState<DocCategory | 'all'>('all');
  const { data, loading, error } = usePublishedDocuments(
    (signal) => fetchDocuments({ signal }),
    'library',
  );
  const docs = data || [];
  const rows = (items: DocumentItem[]) =>
    items.length ? (
      items.map((doc) => <DocumentRow key={doc.id} document={doc} />)
    ) : (
      <EmptySection />
    );
  return (
    <div className="py-section-sm lg:py-section">
      <Container>
        <SectionHeading
          title="Documents"
          description="Explore Y.O.U governance documents, membership resources, careers, and annual reports."
        />
        <div className="grid lg:grid-cols-[250px_1fr] gap-8 lg:gap-14 mt-8">
          <aside>
            <nav
              aria-label="Document categories"
              className="flex flex-col gap-2 lg:sticky lg:top-28"
            >
              {[{ key: 'all', label: 'All Documents' }, ...CATEGORIES].map(
                (cat) => (
                  <button
                    type="button"
                    key={cat.key}
                    aria-pressed={active === cat.key}
                    onClick={() => setActive(cat.key as typeof active)}
                    className={`flex items-center gap-3 py-3 text-left ${active === cat.key ? 'text-brand font-semibold' : 'text-neutral-700'}`}
                  >
                    <span
                      className={`h-px bg-gradient-to-r from-[#E42C27] via-[#FBAB1A] to-[#10984F] ${active === cat.key ? 'w-6' : 'w-3 opacity-40'}`}
                    />
                    {cat.label}
                  </button>
                ),
              )}
            </nav>
          </aside>
          <div className="min-w-0" aria-live="polite">
            {loading && <Spin aria-label="Loading documents" />}
            {error && (
              <p role="alert" className="mb-6 text-neutral-600">
                Documents are temporarily unavailable. Please try again shortly.
              </p>
            )}
            {!loading &&
              CATEGORIES.filter(
                (cat) => active === 'all' || cat.key === active,
              ).map((cat) => (
                <section key={cat.key} className="mb-12" aria-label={cat.label}>
                  <h2 className="text-2xl font-semibold mb-5">{cat.label}</h2>
                  {cat.key === 'annual-reports' ? (
                    <div className="grid sm:grid-cols-2 gap-6">
                      {docs
                        .filter((doc) => doc.category === cat.key)
                        .map((doc) => (
                          <Link
                            key={doc.id}
                            to={ROUTES.DOCUMENT_DETAIL(doc.slug || doc.id)}
                            className="overflow-hidden rounded-2xl border border-neutral-200 hover:shadow-lg transition-shadow"
                          >
                            {doc.coverImageUrl ? (
                              <img
                                src={doc.coverImageUrl}
                                alt={doc.title}
                                loading="lazy"
                                className="aspect-[4/3] w-full object-cover"
                              />
                            ) : (
                              <div className="aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-blue-50 to-emerald-50 text-brand font-semibold">
                                Annual Report
                              </div>
                            )}
                            <div className="p-5">
                              <h3 className="text-xl font-semibold">
                                {doc.title}
                              </h3>
                              <p className="text-sm text-neutral-500 mt-2">
                                {documentCaption(doc)}
                              </p>
                            </div>
                          </Link>
                        ))}
                      {!docs.some((doc) => doc.category === cat.key) && (
                        <EmptySection />
                      )}
                    </div>
                  ) : (
                    <>
                      {DOCUMENT_CATALOG.filter(
                        (item) => item.category === cat.key,
                      ).map((item) => (
                        <details key={item.key} open className="mb-6">
                          <summary className="cursor-pointer font-semibold text-lg text-brand py-2 border-b border-neutral-100">
                            {item.title}
                          </summary>
                          {item.key === 'careers' ? (
                            <div className="pl-3 sm:pl-5">
                              {CAREER_CONTINENTS.map((continent) => (
                                <details key={continent} className="mt-3">
                                  <summary className="cursor-pointer font-medium py-2">
                                    {continent}
                                  </summary>
                                  {rows(
                                    docs.filter(
                                      (doc) =>
                                        doc.section === 'careers' &&
                                        doc.continent === continent,
                                    ),
                                  )}
                                </details>
                              ))}
                              {docs.some(
                                (doc) =>
                                  doc.section === 'careers' && !doc.continent,
                              ) && (
                                <div className="mt-4">
                                  <h4 className="font-medium">
                                    Shared career documents
                                  </h4>
                                  {rows(
                                    docs.filter(
                                      (doc) =>
                                        doc.section === 'careers' &&
                                        !doc.continent,
                                    ),
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            rows(
                              docs.filter(
                                (doc) =>
                                  doc.category === cat.key &&
                                  doc.section === item.key,
                              ),
                            )
                          )}
                        </details>
                      ))}
                      {docs.some(
                        (doc) =>
                          doc.category === cat.key &&
                          !DOCUMENT_CATALOG.some(
                            (item) => item.key === doc.section,
                          ),
                      ) && (
                        <div>
                          <h3 className="font-semibold">Other documents</h3>
                          {rows(
                            docs.filter(
                              (doc) =>
                                doc.category === cat.key &&
                                !DOCUMENT_CATALOG.some(
                                  (item) => item.key === doc.section,
                                ),
                            ),
                          )}
                        </div>
                      )}
                    </>
                  )}
                </section>
              ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
