import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { ViewAllButton } from '@/components/shared/ViewAllButton';
import { Container } from '@/components/ui/Container';
import { ROUTES } from '@/routes/paths';
import { fetchLeadership, type LeadershipRoster } from '@/api/leadership';
import { currentTermLabel } from '@/lib/utils';
import { ExecutiveCard } from '@/components/leadership/ExecutiveCard';
import { TeamMemberCard } from '@/components/leadership/TeamMemberCard';

export function TeamSection() {
  const [leadership, setLeadership] = useState<LeadershipRoster>({ executives: [], directors: [] });
  const [directorIndex, setDirectorIndex] = useState(0);
  const [manualNavigationCount, setManualNavigationCount] = useState(0);
  const leaders = leadership.executives;
  const directors = leadership.directors;
  const activeDirector = directors[directorIndex];
  const previewDirectors = directors.slice(0, 5);

  useEffect(() => {
    const controller = new AbortController();
    fetchLeadership({ signal: controller.signal })
      .then(setLeadership)
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          console.error('Failed to load leadership from CMS', error);
        }
      });
    return () => controller.abort();
  }, []);

  const showPreviousDirector = () => {
    if (!directors.length) return;
    setDirectorIndex((current) => (current - 1 + directors.length) % directors.length);
    setManualNavigationCount((current) => current + 1);
  };

  const showNextDirector = () => {
    if (!directors.length) return;
    setDirectorIndex((current) => (current + 1) % directors.length);
    setManualNavigationCount((current) => current + 1);
  };

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (!directors.length) return;
      setDirectorIndex((current) => (current + 1) % directors.length);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [manualNavigationCount, directors.length]);

  return (
    <section className="bg-white py-0">
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
          Executive Leadership {currentTermLabel()}
        </h3>
        <div className="mx-auto grid grid-cols-2 lg:grid-cols-3 justify-items-center gap-x-4 gap-y-8 sm:gap-x-8 lg:max-w-[860px] lg:gap-[24px] mb-8 lg:mb-[40px]">
          {leaders.map((leader, index) => (
            <div key={leader.id} className={`w-full max-w-[280px] ${index === 0 ? 'col-span-2 lg:col-span-1' : ''}`}>
              <ExecutiveCard member={leader} />
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
        {activeDirector ? (
          <div className="flex flex-col items-center mb-10 lg:hidden">
            <div className="flex items-center justify-center gap-4 sm:gap-6 w-full max-w-[320px]">
              <button
                type="button"
                onClick={showPreviousDirector}
                aria-label="Previous directors"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#EE334E] text-[#EE334E] transition-colors hover:bg-[#EE334E] hover:text-white sm:h-10 sm:w-10"
              >
                <Icon name="lucide:chevron-left" size={20} />
              </button>
              
              <div className="w-full">
                 <TeamMemberCard member={activeDirector} avatarSize="3xl" />
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
          </div>
        ) : null}

        {/* Desktop grid */}
        <div className="hidden lg:grid grid-cols-5 justify-items-center gap-[32px] mb-[60px]">
          {previewDirectors.map((dir) => (
            <div key={dir.id} className="w-full max-w-[200px]">
              <TeamMemberCard member={dir} avatarSize="4xl" />
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