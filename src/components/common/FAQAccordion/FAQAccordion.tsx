import { Collapse } from 'antd';
import { cn } from '@/lib/utils';
import type { FAQ } from '@/types';

export interface FAQAccordionProps {
  items: FAQ[];
  defaultActiveId?: string;
  className?: string;
}

export function FAQAccordion({ items, defaultActiveId, className }: FAQAccordionProps) {
  return (
    <Collapse
      defaultActiveKey={defaultActiveId ? [defaultActiveId] : undefined}
      accordion
      className={cn('faq-accordion bg-transparent border-0', className)}
      items={items.map((faq) => ({
        key: faq.id,
        label: <span className="font-semibold text-neutral-800">{faq.question}</span>,
        children: <p className="text-neutral-600 leading-relaxed">{faq.answer}</p>,
      }))}
    />
  );
}
