import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import type { FAQ } from '@/types';

interface FAQSectionProps {
  faqs: FAQ[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <section className="py-16 lg:py-24 bg-white">
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-neutral-900">
            Frequently Asked <span className="text-brand">Questions</span>
          </h2>
          <Button as="router-link" to="/faq" variant="outline" size="sm">
            View all
          </Button>
        </div>

        {/* Accordion */}
        <div className="max-w-[1106px] mx-auto">
          {faqs.map((faq, i) => (
            <div key={faq.id}>
              <button
                className="w-full flex items-center justify-between py-5 text-left group"
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                aria-expanded={openId === faq.id}
              >
                <span
                  className={`font-medium text-base pr-8 ${
                    openId === faq.id ? 'text-brand' : 'text-neutral-900'
                  }`}
                >
                  {faq.question}
                </span>
                <Icon
                  name={openId === faq.id ? 'icon-park:up' : 'icon-park:down'}
                  size={24}
                  className={`flex-shrink-0 transition-transform ${
                    openId === faq.id ? 'text-brand' : 'text-neutral-500'
                  }`}
                />
              </button>

              {openId === faq.id && (
                <div className="pb-5 pr-10">
                  <p className="text-neutral-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              )}

              {i < faqs.length - 1 && <hr className="border-neutral-200" />}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
