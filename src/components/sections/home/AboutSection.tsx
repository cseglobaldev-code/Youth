// src/components/sections/home/AboutSection.tsx
import { useEffect, useRef, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Image } from 'antd';
import { Icon } from '@/components/ui/Icon';
import { ROUTES } from '@/routes/paths';
import { StrapiService } from '@/lib/strapi';
import type { StatItem } from '@/types';

type AboutItem = {
  id: 'vision' | 'mission' | 'approach' | 'why';
  title: string;
  color: string;
  description: string;
  image: string;
};

const ABOUT_ITEMS: AboutItem[] = [
  { id: 'vision', title: 'Our Vision', color: '#F4F4F4', description: 'A world where every young person has the platform and tools to lead positive change in their community and beyond.', image: '/images/home/about/about-image.png' },
  { id: 'mission', title: 'Our Mission', color: '#F4F4F4', description: 'To connect, support, and amplify youth-led organizations globally through collaboration, capacity building, and shared resources for sustainable development.', image: '/images/home/about/about-image2.jpeg' },
  { id: 'approach', title: 'Our Approach', color: '#F4F4F4', description: 'We build bridges across borders, cultures, and generations by facilitating partnerships, joint programs, and knowledge exchange between youth organizations worldwide.', image: '/images/home/about/about-image3.jpeg' },
  { id: 'why', title: 'Why join us', color: '#F4F4F4', description: 'Join a global network of 50+ organizations across 30 countries, access funding opportunities, leadership training, and collaborative projects aligned with the UN SDGs.', image: '/images/home/about/about-image4.jpeg' },
];

export function AboutSection() {
  const [activeId, setActiveId] = useState<AboutItem['id']>('vision');
  const [stats, setStats] = useState<StatItem[]>([]);
  const [hasStartedStats, setHasStartedStats] = useState(false);
  const [statValues, setStatValues] = useState<number[]>([]);
  const statsRef = useRef<HTMLDivElement>(null);

  const activeItem = ABOUT_ITEMS.find((item) => item.id === activeId) ?? ABOUT_ITEMS[0];

  useEffect(() => {
    StrapiService.getStatItems()
      .then((data) => {
        if (data.length > 0) {
          setStats(data);
        } else {
          setStats(defaultStats);
        }
      })
      .catch((err) => {
        console.error('Error fetching stats:', err);
        setStats(defaultStats);
      });
  }, []);

  const defaultStats = [
    { id: 'members', label: 'Member Organizations', value: 50, prefix: '+' },
    { id: 'continents', label: 'Continents', value: 6, prefix: '+' },
    { id: 'countries', label: 'Countries', value: 30, prefix: '+' },
    { id: 'volunteers', label: 'Volunteers from Global', value: 1500, prefix: '+' },
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  useEffect(() => {
    if (displayStats.length > 0) {
      setStatValues(displayStats.map(() => 0));
    }
  }, [stats]);

  useEffect(() => {
    const statsElement = statsRef.current;
    if (!statsElement || hasStartedStats || displayStats.length === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStartedStats(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(statsElement);
    return () => observer.disconnect();
  }, [hasStartedStats, displayStats]);

  useEffect(() => {
    if (!hasStartedStats || displayStats.length === 0) return;

    const targets = displayStats.map((stat) => stat.value);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setStatValues(targets);
      return;
    }

    const duration = 1200;
    const startTime = performance.now();
    let frameId = 0;

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      setStatValues(targets.map((target) => Math.round(target * easedProgress)));

      if (progress < 1) frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [hasStartedStats, displayStats]);

  function renderFormattedStat(stat: StatItem, animatedValue: number) {
    const prefix = stat.prefix || '';
    const suffix = stat.suffix || '';
    const formattedNum = animatedValue.toLocaleString('en-US').replace(/,/g, ' ');
    return `${prefix}${formattedNum}${suffix}`;
  }

  return (
    <>
      <section className="bg-white pb-0 pt-0">
        <Container>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12">
            <div className="flex-shrink-0">
              <Image
                src="/images/home/about/sdg-goals-logo.png"
                alt="UN Sustainable Development Goals"
                preview={false}
                className="h-16 sm:h-[87px] w-auto object-contain"
                style={{ width: 'auto', objectFit: 'contain' }}
              />
            </div>
            <div className="flex flex-col items-center sm:items-start gap-6 max-w-[560px] w-full">
              <p className="text-neutral-700 text-[clamp(1rem,1.56vw,1.5rem)] font-normal leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Y.O.U is a coalition of youth organizations united by a shared commitment to the UN Sustainable Development Goals.
              </p>
              <Button as="router-link" to={ROUTES.MEMBERS} variant="primary" size="lg" className="w-full justify-center rounded-full bg-[#EE334E] px-6 transition-all duration-200 hover:bg-[#EE334E] hover:opacity-90 active:scale-[0.98] sm:w-auto sm:px-8 lg:mb-[120px]">
                Join 1,500+ Youth Leaders
              </Button>
            </div>
          </div>

          <div ref={statsRef} className="bg-[#F2F7FF] rounded-3xl lg:rounded-[40px] px-4 sm:px-6 lg:px-10 py-6 lg:py-10 mt-10 lg:mt-0">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0">
              {displayStats.slice(0, 4).map((stat, index) => (
                <div key={stat.label} className="flex items-center min-w-0">
                  <div className="flex flex-col items-center text-center w-full py-2">
                    <span className="text-neutral-500 text-[clamp(0.875rem,1.56vw,1.5rem)] font-normal" style={{ fontFamily: 'Open Sans, sans-serif' }}>{stat.label}</span>
                    <span
                      className="font-semibold text-[clamp(1.75rem,3.13vw,3rem)] text-[#1E293B]"
                      aria-label={`${stat.value} ${stat.label}`}
                      style={{ fontFamily: 'Open Sans, sans-serif' }}
                    >
                      {renderFormattedStat(stat, statValues[index] || 0)}
                    </span>
                  </div>
                  {index < displayStats.length - 1 && (
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

      <section className="bg-white pb-0 pt-12 md:pt-16 lg:pt-[7.5rem]">
        <Container>
          <div className="text-left mb-8 lg:mb-12">
            <h2 className="font-heading font-semibold text-[clamp(1.75rem,3.13vw,3rem)] leading-tight">
              <span className="text-neutral-900">A Global Alliance for </span>
              <span className="bg-gradient-to-r from-[#E42C27] via-[#FBAB1A] to-[#10984F] bg-clip-text text-transparent">
                Youth-Led Impact
              </span>
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="min-w-0 flex-1 max-w-full lg:max-w-[602px]">
              {ABOUT_ITEMS.map((item, index) => {
                const isActive = item.id === activeId;
                const isLast = index === ABOUT_ITEMS.length - 1;
                return (
                  <div key={item.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(item.id)}
                      onMouseEnter={() => setActiveId(item.id)}
                      className="group w-full cursor-pointer border-0 bg-transparent p-0 text-left"
                      aria-expanded={isActive}
                    >
                      <div className="flex items-center gap-3 sm:gap-5 py-3">
                        <div className="w-10 h-10 sm:w-[48px] sm:h-[48px] rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.color }}>
                          <img src="/images/common/decor/group.svg" alt="" className="w-6 h-6 sm:w-[30px] sm:h-[30px] object-contain" aria-hidden="true" />
                        </div>
                        <h4 className="font-semibold text-[#111111] text-[clamp(1.25rem,1.82vw,1.75rem)]">
                          {item.title}
                        </h4>
                      </div>
                      {isActive && (
                        <div className="pl-[52px] sm:pl-[68px] pr-2 pb-3">
                          <p className="text-neutral-600 text-[clamp(1rem,1.30vw,1.25rem)] font-normal leading-relaxed">
                            {item.description}
                          </p>
                          <span className="mt-4 inline-flex items-center gap-2 font-semibold text-[#EE334E] text-[clamp(1rem,1.30vw,1.25rem)]">
                            See more
                            <Icon name="lucide:arrow-up-right" size={20} />
                          </span>
                        </div>
                      )}
                    </button>

                    {!isLast && (
                      <div
                        className="h-px w-full"
                        style={
                          isActive
                            ? {
                                background:
                                  'linear-gradient(90deg, #EE334E 0%, #FCB131 33.33%, #00A651 66.67%, #0081C8 100%)',
                              }
                            : {
                                backgroundImage:
                                  'repeating-linear-gradient(90deg, #DEDEDE 0 4px, transparent 4px 8px)',
                              }
                        }
                        aria-hidden="true"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="w-full min-w-0 flex-1 lg:basis-[52%] xl:max-w-[702px]">
              <div className="rounded-2xl overflow-hidden aspect-[702/513] relative">
                <Image
                  key={activeItem.image}
                  src={activeItem.image}
                  alt={activeItem.title}
                  preview={false}
                  className="w-full h-full object-cover"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  wrapperStyle={{ width: '100%', height: '100%' }}
                />
                {activeItem.id === 'vision' && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                    <img
                      src="/images/common/decor/group.svg"
                      alt=""
                      aria-hidden="true"
                      className="w-[18%] h-auto object-contain opacity-20"
                      style={{ marginTop: '15%', marginLeft: '5%' }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}