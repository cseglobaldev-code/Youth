import { useEffect, useState } from 'react';
import { Collapse, Skeleton } from 'antd';
import { Icon } from '@/components/ui/Icon';
import { ViewAllButton } from '@/components/shared/ViewAllButton';
import { ROUTES } from '@/routes/paths';
import { fetchFAQs, type FAQ } from '@/api/faqs';
import { cn } from '@/lib/utils';
import type { FaqSectionBlockData } from '@/types';

export function FaqSectionBlock({ data }: { data: FaqSectionBlockData }) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(data.useGlobalFaqs);

  useEffect(() => {
    if (data.useGlobalFaqs) {
      fetchFAQs()
        .then(setFaqs)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [data.useGlobalFaqs]);

  const items = data.useGlobalFaqs
    ? faqs
    : (data.customFaqs || []).map((f, i) => ({ id: `faq-${i}`, question: f.question, answer: f.answer }));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-semibold text-2xl md:text-4xl text-[#111111] leading-tight" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            {data.title}
          </h2>
          {data.description && <p className="mt-2 text-neutral-600 text-base">{data.description}</p>}
        </div>
        {data.showViewAllButton && <ViewAllButton to={ROUTES.POLICY_DOCUMENTS} />}
      </div>

      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <Collapse
          accordion
          ghost
          expandIconPosition="end"
          expandIcon={({ isActive }) => (
            <Icon name="lucide:chevron-down" size={22} className={cn('text-[#EE334E] transition-transform duration-200', isActive && 'rotate-180')} />
          )}
          items={items.map((faq) => ({
            key: faq.id,
            label: <span className="font-medium text-lg text-[#111111] pr-8" style={{ fontFamily: 'Open Sans, sans-serif' }}>{faq.question}</span>,
            children: <p className="pb-4 text-base text-neutral-600 leading-relaxed">{faq.answer}</p>,
            style: { borderBottom: '1px solid #E5E7EB' },
          }))}
        />
      )}
    </div>
  );
}