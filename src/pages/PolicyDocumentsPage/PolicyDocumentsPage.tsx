import { useState, useMemo } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { DocumentRow } from '@/components/common/DocumentRow';
import { cn } from '@/lib/utils';
import { DOCUMENTS_DATA } from '@/data';
import type { DocCategory } from '@/types';

const CATEGORIES: { key: DocCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All Documents' },
  { key: 'governance', label: 'Governance' },
  { key: 'membership', label: 'Membership' },
  { key: 'annual-reports', label: 'Annual Reports' },
];

export function PolicyDocumentsPage() {
  const [activeCategory, setActiveCategory] = useState<DocCategory | 'all'>('all');

  const filteredDocs = useMemo(
    () =>
      activeCategory === 'all'
        ? DOCUMENTS_DATA
        : DOCUMENTS_DATA.filter((d) => d.category === activeCategory),
    [activeCategory]
  );

  return (
    <div className="py-section-sm lg:py-section">
      <Container>
        <SectionHeading
          eyebrow="Resources"
          title="Policy & Documents"
          description="Access governance documents, membership guides, and annual reports."
        />

        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="space-y-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={cn(
                  'w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  activeCategory === cat.key
                    ? 'bg-brand-50 text-brand'
                    : 'text-neutral-600 hover:bg-neutral-50'
                )}
              >
                {cat.label}
              </button>
            ))}
          </aside>

          {/* Document list */}
          <div className="space-y-3">
            {filteredDocs.map((doc) => (
              <DocumentRow key={doc.id} document={doc} />
            ))}
            {filteredDocs.length === 0 && (
              <p className="text-center text-neutral-500 py-8">No documents in this category.</p>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
