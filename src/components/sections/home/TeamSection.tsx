import { useEffect, useState } from 'react';
import { Image } from 'antd';
import { Icon } from '@/components/ui/Icon';
import { ViewAllButton } from '@/components/common/ViewAllButton';
import { Container } from '@/components/ui/Container';
import { ROUTES } from '@/routes/paths';
import { EXECUTIVE_LEADERSHIP, TEAM_DATA } from '@/data';

// Single source of truth (see src/data/team.ts) — shared with the /leadership page.
const LEADERS = EXECUTIVE_LEADERSHIP;
const DIRECTORS = TEAM_DATA;
const PREVIEW_DIRECTORS = DIRECTORS.slice(0, 5);

export function TeamSection() {
  const [directorIndex, setDirectorIndex] = useState(0);
  const [manualNavigationCount, setManualNavigationCount] = useState(0);
  const activeDirector = DIRECTORS[directorIndex];

  const showPreviousDirector = () => {
    setDirectorIndex((current) => (current - 1 + DIRECTORS.length) % DIRECTORS.length);
    setManualNavigationCount((current) => current + 1);
  };

  const showNextDirector = () => {
    setDirectorIndex((current) => (current + 1) % DIRECTORS.length);
    setManualNavigationCount((current) => current + 1);
  };

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setDirectorIndex((current) => (current + 1) % DIRECTORS.length);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [manualNavigationCount]);
  return (
    <section className="bg-white py-12 md:py-16 lg:py-[120px]">
      <Container size="wide">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-[60px]">
          <h2 className="font-semibold text-[clamp(1.5rem,3.13vw,3rem)] leading-tight" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            The People Behind{' '}
            <span className="bg-gradient-to-r from-[#E42C27] via-[#FBAB1A] to-[#10984F] bg-clip-text text-transparent">
              Y.O.U
            </span>
          </h2>
        </div>

        {/* Leaders — 3 large circles */}
        <h3 className="mb-8 text-center font-semibold text-[clamp(1.25rem,1.82vw,1.75rem)] text-[#111111] lg:mb-[40px]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          Executive Leadership 2020 - 2026
        </h3>
        <div className="mx-auto grid grid-cols-2 lg:grid-cols-3 justify-items-center gap-x-4 gap-y-8 sm:gap-x-8 lg:max-w-[860px] lg:gap-[24px] mb-8 lg:mb-[40px]">
          {LEADERS.map((leader, index) => (
            <div key={leader.id} className={`flex flex-col items-center max-w-[280px] ${index === 0 ? 'col-span-2 lg:col-span-1' : ''}`}>
              <div className="w-40 h-40 sm:w-52 sm:h-52 lg:w-[240px] lg:h-[240px] rounded-full overflow-hidden border-4 border-neutral-200 mb-4 relative group cursor-pointer">
                <Image src={leader.avatarUrl} alt={leader.name} preview={false} className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-50" style={{ width: '100%', height: '100%', objectFit: 'cover' }} wrapperStyle={{ width: '100%', height: '100%' }} />
                <div className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-3">
                    <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
                      <Icon name="jam:facebook" size={16} className="text-[#1877F2]" />
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
                      <Icon name="jam:linkedin" size={16} className="text-[#0A66C2]" />
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
                      <Icon name="ic:baseline-tiktok" size={16} className="text-[#111111]" />
                    </a>
                  </div>
                </div>
              </div>
              <h4 className="font-semibold text-[clamp(1rem,1.30vw,1.25rem)] text-[#111111] text-center" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                {leader.name}
              </h4>
              <p className="text-[clamp(0.875rem,1.04vw,1rem)] text-neutral-500 text-center" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                {leader.role}
              </p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <hr className="border-neutral-200 my-10 lg:my-[60px]" />

        {/* Continental Directors */}
        <div className="text-center mb-8 lg:mb-[40px]">
          <h3 className="font-semibold text-[clamp(1.5rem,1.82vw,1.75rem)] text-[#111111]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Continental Directors
          </h3>
        </div>

        {/* Mobile/tablet carousel */}
        <div className="flex flex-col items-center mb-10 lg:hidden">
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={showPreviousDirector}
              aria-label="Previous directors"
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#EE334E] text-[#EE334E] transition-colors hover:bg-[#EE334E] hover:text-white sm:h-10 sm:w-10"
            >
              <Icon name="lucide:chevron-left" size={20} />
            </button>
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-neutral-200 relative group cursor-pointer transition-all duration-300">
              <Image src={activeDirector.avatarUrl} alt={activeDirector.name} preview={false} className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-50" style={{ width: '100%', height: '100%', objectFit: 'cover' }} wrapperStyle={{ width: '100%', height: '100%' }} />
              <div className="absolute inset-0 flex items-end justify-center pb-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex gap-2">
                  <a href="#" className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
                    <Icon name="jam:facebook" size={14} className="text-[#1877F2]" />
                  </a>
                  <a href="#" className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
                    <Icon name="jam:linkedin" size={14} className="text-[#0A66C2]" />
                  </a>
                  <a href="#" className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
                    <Icon name="ic:baseline-tiktok" size={14} className="text-[#111111]" />
                  </a>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={showNextDirector}
              aria-label="Next directors"
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#EE334E] text-[#EE334E] transition-colors hover:bg-[#EE334E] hover:text-white sm:h-10 sm:w-10"
            >
              <Icon name="lucide:chevron-right" size={20} />
            </button>
          </div>
          <div className="mt-3 flex max-w-[220px] flex-col items-center transition-all duration-300">
            <h4 className="font-semibold text-base text-[#111111] text-center" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              {activeDirector.name}
            </h4>
            <p className="text-sm text-neutral-500 text-center" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              {activeDirector.role}
            </p>
          </div>
        </div>

        {/* Desktop grid */}
        <div className="hidden lg:grid grid-cols-5 justify-items-center gap-[32px] mb-[60px]">
          {PREVIEW_DIRECTORS.map((dir) => (
            <div key={dir.id} className="flex flex-col items-center max-w-[200px]">
              <div className="w-[180px] h-[180px] rounded-full overflow-hidden border-4 border-neutral-200 mb-3 relative group cursor-pointer">
                <Image src={dir.avatarUrl} alt={dir.name} preview={false} className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-50" style={{ width: '100%', height: '100%', objectFit: 'cover' }} wrapperStyle={{ width: '100%', height: '100%' }} />
                <div className="absolute inset-0 flex items-end justify-center pb-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-2">
                    <a href="#" className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
                      <Icon name="jam:facebook" size={14} className="text-[#1877F2]" />
                    </a>
                    <a href="#" className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
                      <Icon name="jam:linkedin" size={14} className="text-[#0A66C2]" />
                    </a>
                    <a href="#" className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
                      <Icon name="ic:baseline-tiktok" size={14} className="text-[#111111]" />
                    </a>
                  </div>
                </div>
              </div>
              <h4 className="font-semibold text-[clamp(0.875rem,1.04vw,1rem)] text-[#111111] text-center" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                {dir.name}
              </h4>
              <p className="text-[clamp(0.8125rem,0.91vw,0.875rem)] text-neutral-500 text-center" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                {dir.role}
              </p>
            </div>
          ))}
        </div>

        {/* View all button */}
        <div className="flex justify-center">
          <ViewAllButton to={ROUTES.LEADERSHIP} />
        </div>
      </Container>
    </section>
  );
}
