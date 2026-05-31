import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

const FAQ_DATA = [
  { id: 'faq-1', question: 'What is Y.O.U and who can join?', answer: 'Y.O.U – Youth Organization Union is a global alliance of youth-led organizations and individual leaders committed to the UN\'s SDGs. Any registered youth organization or young leader can apply.' },
  { id: 'faq-2', question: 'What are the benefits of joining as an organization?', answer: 'Members gain access to a global network, collaborative project opportunities, capacity building resources, funding connections, and visibility through our platform.' },
  { id: 'faq-3', question: 'What are the benefits of joining as an organization?', answer: 'Organizations can participate in joint programs, attend the Annual Summit, and connect with partners across 30+ countries.' },
  { id: 'faq-4', question: 'What is the difference between Continental and Country Directors?', answer: 'Continental Directors oversee operations across an entire continent, while Country Directors manage activities within a specific country.' },
  { id: 'faq-5', question: 'Are there membership fees?', answer: 'No, Y.O.U membership is free for qualifying youth organizations and individual leaders.' },
];

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  return (
    <section className="bg-white py-[120px] px-[407px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-[40px]">
        <h2 className="font-semibold text-[48px] text-[#111111] leading-tight" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          Frequently Asked Questions
        </h2>
        <button className="px-6 py-2.5 border-2 border-[#EE334E] text-[#EE334E] text-[16px] font-semibold rounded-full hover:bg-[#EE334E] hover:text-white transition-colors flex-shrink-0" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          View all
        </button>
      </div>

      {/* FAQ items */}
      <div>
        {FAQ_DATA.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div key={faq.id}>
              <button
                className="w-full flex items-center justify-between py-5 text-left"
                onClick={() => setOpenId(isOpen ? null : faq.id)}
              >
                <span className="font-medium text-[22px] text-[#111111] pr-8" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                  {faq.question}
                </span>
                <Icon
                  name="lucide:chevron-down"
                  size={22}
                  className="text-[#EE334E] flex-shrink-0"
                />
              </button>

              {isOpen && (
                <p className="pb-5 text-[16px] text-neutral-600 font-normal leading-relaxed" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                  {faq.answer}
                </p>
              )}

              {/* Divider */}
              {isOpen
                ? <div className="h-[2px] bg-gradient-to-r from-[#E42C27] via-[#FBAB1A] to-[#10984F] rounded-full" />
                : <hr className="border-dashed border-[#C0D8FF]" />
              }
            </div>
          );
        })}
      </div>
    </section>
  );
}
