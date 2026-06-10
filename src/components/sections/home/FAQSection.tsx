import { Collapse } from 'antd';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';
import { ViewAllButton } from '@/components/common/ViewAllButton';
import { Container } from '@/components/ui/Container';
import { ROUTES } from '@/routes/paths';

const FAQ_DATA = [
  { id: 'faq-1', question: 'What is Y.O.U and who can join?', answer: 'Y.O.U – Youth Organization Union is a global alliance of youth-led organizations and individual leaders committed to the UN\'s SDGs. Any registered youth organization or young leader can apply.' },
  { id: 'faq-2', question: 'What are the benefits of joining as an organization?', answer: 'Members gain access to a global network, collaborative project opportunities, capacity building resources, funding connections, and visibility through our platform.' },
  { id: 'faq-3', question: 'What are the benefits of joining as an organization?', answer: 'Organizations can participate in joint programs, attend the Annual Summit, and connect with partners across 30+ countries.' },
  { id: 'faq-4', question: 'What is the difference between Continental and Country Directors?', answer: 'Continental Directors oversee operations across an entire continent, while Country Directors manage activities within a specific country.' },
  { id: 'faq-5', question: 'Are there membership fees?', answer: 'No, Y.O.U membership is free for qualifying youth organizations and individual leaders.' },
];

export function FAQSection() {
  return (
    <section className="bg-white py-12 md:py-16 lg:py-[120px]">
      <Container size="narrow">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-8 lg:mb-[40px]">
          <h2 className="font-semibold text-2xl sm:text-4xl lg:text-[48px] text-[#111111] leading-tight" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Frequently Asked Questions
          </h2>
          <ViewAllButton to={ROUTES.POLICY_DOCUMENTS} className="flex-shrink-0 !px-4 !py-1.5 !text-sm sm:!px-6 sm:!py-2.5 sm:!text-[16px]" />
        </div>

        {/* FAQ items */}
        <Collapse
          defaultActiveKey={['faq-1']}
          ghost
          expandIconPosition="end"
          expandIcon={({ isActive }) => (
            <Icon name="lucide:chevron-down" size={22} className={cn('text-[#EE334E] transition-transform duration-200', isActive && 'rotate-180')} />
          )}
          items={FAQ_DATA.map((faq) => ({
            key: faq.id,
            label: <span className="font-medium text-lg sm:text-xl lg:text-[22px] text-[#111111] pr-8" style={{ fontFamily: 'Open Sans, sans-serif' }}>{faq.question}</span>,
            children: <p className="pb-5 text-sm sm:text-[16px] text-neutral-600 font-normal leading-relaxed" style={{ fontFamily: 'Open Sans, sans-serif' }}>{faq.answer}</p>,
            style: { borderBottom: '1px solid #E5E7EB' },
          }))}
          className="!bg-transparent"
        />
      </Container>
    </section>
  );
}
