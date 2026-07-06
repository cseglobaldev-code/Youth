// src/pages/PolicyDocumentsPage/PolicyDocumentsPage.tsx
import { useState, useMemo, useEffect } from 'react';
import { Empty, Spin } from 'antd';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { DocumentRow } from '@/components/common/DocumentRow';
import { cn } from '@/lib/utils';
import { StrapiService } from '@/lib/strapi';
import type { DocumentItem, DocCategory } from '@/types';

const CATEGORIES: { key: DocCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All Documents' },
  { key: 'governance', label: 'Governance Documents' },
  { key: 'membership', label: 'Membership Documents' },
  { key: 'annual-reports', label: 'Annual Reports' },
];

export function PolicyDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<DocCategory | 'all'>('all');

  // Fetch documents dynamically from Strapi
  useEffect(() => {
    StrapiService.getDocuments()
      .then((data) => {
        setDocuments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Unable to load documents at this time.');
        setLoading(false);
      });
  }, []);

  const filteredDocs = useMemo(
    () =>
      activeCategory === 'all'
        ? documents
        : documents.filter((d) => d.category === activeCategory),
    [documents, activeCategory]
  );

  return (
    <div className="py-section-sm lg:py-section">
      <Container>
        <SectionHeading
          title="Policy & Documents"
          description="All official Y.O.U governance documents, membership agreements, policy frameworks, and annual reports are available here for full transparency."
        />

        <div className="grid lg:grid-cols-[260px_1fr] gap-10 lg:gap-16 mt-4">
          {/* Sidebar */}
          <aside className="flex flex-col gap-1">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveCategory(cat.key)}
                  className={cn(
                    'group flex items-center gap-3 text-left py-2.5 text-base font-semibold transition-colors',
                    active ? 'text-brand' : 'text-neutral-700 hover:text-brand'
                  )}
                >
                  <span
                    className={cn(
                      'h-0.5 rounded-full transition-all duration-200',
                      active
                        ? 'w-6 bg-brand'
                        : 'w-0 bg-brand group-hover:w-6'
                    )}
                  />
                  {cat.label}
                </button>
              );
            })}
          </aside>

          {/* Document list with loaders and error states */}
          <div className="divide-y divide-neutral-200">
            {loading ? (
              <div className="py-12 text-center">
                <Spin size="large" tip="Loading documents..." />
              </div>
            ) : error ? (
              <div className="py-12 text-center text-red-500">
                <p>{error}</p>
              </div>
            ) : filteredDocs.length === 0 ? (
              <Empty description="No documents in this category." className="py-8" />
            ) : (
              filteredDocs.map((doc) => (
                <DocumentRow key={doc.id} document={doc} />
              ))
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}