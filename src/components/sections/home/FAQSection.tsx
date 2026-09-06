import { useEffect, useState } from 'react';
import { Collapse } from 'antd';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { fetchFAQs, type FAQ } from '@/api/faqs';

const FALLBACK_FAQS: FAQ[] = [
  {
    id: 'faq-1',
    question: 'What is the Youth Organization Union (Y.O.U)?',
    answer: 'Y.O.U is a global coalition of youth-led organizations united by a shared commitment to the UN Sustainable Development Goals, building bridges across borders, cultures, and generations.',
  },
  {
    id: 'faq-2',
    question: 'How can our organization become a member?',
    answer: 'Youth organizations can register directly through our online Membership Registration form. Applications are reviewed by our Partnerships Committee.',
  },
  {
    id: 'faq-3',
    question: 'What roles can individual young leaders apply for?',
    answer: 'Young leaders can apply for Continental Director and Country Director positions to lead regional chapters and represent their communities in global youth diplomacy.',
  },
];

export function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>(FALLBACK_FAQS);

  useEffect(() => {
    const controller = new AbortController();

    fetchFAQs({ signal: controller.signal })
      .then((data) => {
        if (data.length > 0) setFaqs(data);
      })
      .catch(() => {
        // Fall back to preset FAQs
      });

    return () => controller.abort();
  }, []);

  return (
    <section className="bg-white pb-12 pt-0 md:pb-16 lg:pb-[7.5rem]">
      <Container className="max-w-[95%] sm:max-w-[85%]">
        <div className="flex items-center justify-between gap-3 mb-8 lg:mb-[40px]">
          <h2 className="font-semibold text-[clamp(2rem,3.13vw,3rem)] text-[#111111] leading-tight" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Frequently Asked Questions
          </h2>
        </div>

        <Collapse
          accordion
          defaultActiveKey={faqs[0]?.id}
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