import { useState } from 'react';
import type { CollapseProps } from 'antd';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Collapse, Image } from 'antd';
import { ROUTES } from '@/routes/paths';

const ABOUT_ITEMS = [
  { id: 'vision', title: 'Our Vision', color: '#FFECEF', description: 'A world where every young person has the platform and tools to lead positive change in their community and beyond.' },
  { id: 'mission', title: 'Our Mission', color: '#D2FFD9', description: 'To connect, support, and amplify youth-led organizations globally through collaboration, capacity building, and shared resources for sustainable development.' },
  { id: 'approach', title: 'Our Approach', color: '#E3F4FF', description: 'We build bridges across borders, cultures, and generations by facilitating partnerships, joint programs, and knowledge exchange between youth organizations worldwide.' },
  { id: 'why', title: 'Why join us', color: '#FFF7EA', description: 'Join a global network of 50+ organizations across 30 countries, access funding opportunities, leadership training, and collaborative projects aligned with the UN SDGs.' },
];

export function AboutSection() {
  const [activeId, setActiveId] = useState('vision');

  const handleCollapseChange: NonNullable<CollapseProps['onChange']> = (key) => {
    if (Array.isArray(key)) {
      setActiveId(key[0] ?? '');
      return;
    }

    setActiveId(key ?? '');
  };

  return (
    <>
      {/* Part 1: SDG Goals + CTA + Stats — white background */}
      <section className="pt-0 pb-12 md:pb-16 lg:pb-20 bg-white">
        <Container>
          {/* SDG Goals logo + text + CTA — 2 columns */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12">
            {/* Left: SDG logo */}
            <div className="flex-shrink-0">
              <Image
                src="/images/home/about/sdg-goals-logo.png"
                alt="UN Sustainable Development Goals"
                preview={false}
                className="h-16 sm:h-[87px] w-auto object-contain"
                style={{ width: 'auto', objectFit: 'contain' }}
              />
            </div>
            {/* Right: text + CTA */}
            <div className="flex flex-col items-center sm:items-start gap-6 max-w-[560px] w-full">
              <p className="text-neutral-700 text-[clamp(1rem,1.56vw,1.5rem)] font-normal leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Y.O.U is a coalition of youth organizations united by a shared commitment to the UN
                Sustainable Development Goals - building bridges across borders, cultures, and
                generations.
              </p>
              <Button as="router-link" to={ROUTES.MEMBERS} variant="primary" size="lg" className="w-full justify-center bg-[#EE334E] hover:bg-[#d42a43] rounded-full px-6 sm:w-auto sm:px-8 lg:mb-[120px]">
                Join 1,500+ Youth Leaders
              </Button>
            </div>
          </div>

          {/* Stats row */}
          <div className="bg-[#F2F7FF] rounded-3xl lg:rounded-[40px] px-4 sm:px-6 lg:px-10 py-6 lg:py-10 mt-10 lg:mt-0">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0">
              {[
                { label: 'Member Organizations', value: '+50' },
                { label: 'Continents', value: '+6' },
                { label: 'Countries', value: '+30' },
                { label: 'Volunteers from Global', value: '+1 500' },
              ].map((stat, i, arr) => (
                <div key={stat.label} className="flex items-center min-w-0">
                  <div className="flex flex-col items-center text-center w-full py-2">
                    <span className="text-neutral-500 text-[clamp(0.875rem,1.56vw,1.5rem)] font-normal" style={{ fontFamily: 'Open Sans, sans-serif' }}>{stat.label}</span>
                    <span className="font-semibold text-[clamp(1.75rem,3.13vw,3rem)] text-[#1E293B]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                      {stat.value}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <svg width="24" height="120" viewBox="0 0 24 120" className="hidden lg:block flex-shrink-0" aria-hidden="true">
                      <line x1="20" y1="0" x2="4" y2="120" stroke="#C0D8FF" strokeWidth="1.5" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Part 2: About Vision */}
      <section className="py-12 md:py-16 lg:py-24 bg-white">
        <Container>
          {/* Heading */}
          <div className="text-left mb-8 lg:mb-12">
            <h2 className="font-heading font-semibold text-[clamp(1.75rem,3.13vw,3rem)] leading-tight">
              <span className="text-neutral-900">A Global Alliance for </span>
              <span className="bg-gradient-to-r from-[#E42C27] via-[#FBAB1A] to-[#10984F] bg-clip-text text-transparent">
                Youth-Led Impact
              </span>
            </h2>
          </div>

          {/* Content: accordion left + image right */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left: list items */}
            <div className="flex-1 max-w-full lg:max-w-[602px]">
              <Collapse
                accordion
                ghost
                activeKey={activeId ?? undefined}
                onChange={handleCollapseChange}
                expandIcon={() => null}
                items={ABOUT_ITEMS.map((item) => ({
                  key: item.id,
                  label: (
                    <div className="flex items-start gap-3 sm:gap-5 py-3">
                      <div className="w-10 h-10 sm:w-[48px] sm:h-[48px] rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.color }}>
                        <img src="/images/common/decor/group.svg" alt="" className="w-6 h-6 sm:w-[30px] sm:h-[30px] object-contain" aria-hidden="true" />
                      </div>
                      <h4 className="font-semibold text-[#111111] text-[clamp(1.25rem,1.82vw,1.75rem)]">{item.title}</h4>
                    </div>
                  ),
                  children: (
                    <p className="text-neutral-600 text-[clamp(1rem,1.30vw,1.25rem)] font-normal leading-relaxed">{item.description}</p>
                  ),
                }))}
              />
            </div>

            {/* Right: image with logo overlay */}
            <div className="flex-shrink-0 w-full lg:w-[52%] xl:w-[702px]">
              <div className="rounded-2xl overflow-hidden aspect-[702/513] relative">
                <Image
                  src="/images/home/about/about-image.png"
                  alt="Youth leaders"
                  preview={false}
                  className="w-full h-full object-cover"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  wrapperStyle={{ width: '100%', height: '100%' }}
                />
                {/* Logo overlay */}
                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                  <img
                    src="/images/common/decor/group.svg"
                    alt=""
                    aria-hidden="true"
                    className="w-[18%] h-auto object-contain opacity-20"
                    style={{ marginTop: '15%', marginLeft: '5%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
