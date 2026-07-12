// src/components/sections/home/FAQSection.tsx
import { useEffect, useState } from 'react';
import { Collapse, Spin } from 'antd';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';
import { ViewAllButton } from '@/components/common/ViewAllButton';
import { Container } from '@/components/ui/Container';
import { ROUTES } from '@/routes/paths';
import { StrapiService } from '@/lib/strapi';
import type { FAQ } from '@/types';

export function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    StrapiService.getFAQs()
      .then((data) => {
        setFaqs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="py-12 text-center bg-white">
        <Spin size="large" tip="Đang tải các câu hỏi..." />
      </div>
    );
  }

  if (faqs.length === 0) return null;

  return (
    <section className="bg-white pb-12 pt-0 md:pb-16 lg:pb-[7.5rem]">
      <Container size="narrow">
        <div className="flex items-center justify-between gap-3 mb-8 lg:mb-[40px]">
          <h2 className="font-semibold text-[clamp(1.5rem,3.13vw,3rem)] text-[#111111] leading-tight" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Frequently Asked Questions
          </h2>
          <ViewAllButton to={ROUTES.POLICY_DOCUMENTS} className="flex-shrink-0 !px-4 !py-1.5 !text-sm sm:!px-6 sm:!py-2.5 sm:!text-[16px]" />
        </div>

        <Collapse
          accordion
          defaultActiveKey={faqs[0]?.id ? [faqs[0].id] : undefined}
          ghost
          expandIconPosition="end"
          expandIcon={({ isActive }) => (
            <Icon name="lucide:chevron-down" size={22} className={cn('text-[#EE334E] transition-transform duration-200', isActive && 'rotate-180')} />
          )}
          items={faqs.map((faq) => ({
            key: faq.id,
            label: <span className="font-medium text-[clamp(1.125rem,1.43vw,1.375rem)] text-[#111111] pr-8" style={{ fontFamily: 'Open Sans, sans-serif' }}>{faq.question}</span>,
            children: <p className="pb-5 text-[clamp(0.875rem,1.04vw,1rem)] text-neutral-600 font-normal leading-relaxed" style={{ fontFamily: 'Open Sans, sans-serif' }}>{faq.answer}</p>,
            style: { borderBottom: '1px solid #E5E7EB' },
          }))}
          className="!bg-transparent"
        />
      </Container>
    </section>
  );
}