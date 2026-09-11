import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { ICONS, SOCIAL_COLORS } from '@/config/icons';
import { ViewAllButton } from '@/components/shared/ViewAllButton';
import { Container } from '@/components/ui/Container';
import { ROUTES } from '@/routes/paths';
import { fetchLeadership, type LeadershipRoster } from '@/api/leadership';
import { currentTermLabel } from '@/lib/utils';
import type { TeamMember } from '@/types';

const FALLBACK_EXECUTIVES: TeamMember[] = [
  {
    id: 'exec-1',
    name: 'Safin Hussein Mohammed',
    role: 'Chair/ President',
    avatarUrl: '/images/home/team/exec-safin.png',
    continent: 'Africa',
    socialLinks: [{ platform: 'linkedin', url: 'https://linkedin.com' }],
  },
  {
    id: 'exec-2',
    name: 'Thuy Linh Nguyen T. (Emily)',
    role: 'Chair/ Vice President',
    avatarUrl: '/images/home/team/exec-linh.png',
    continent: 'Asia',
    socialLinks: [{ platform: 'linkedin', url: 'https://linkedin.com' }],
  },
  {
    id: 'exec-3',
    name: 'Theodora Abena Yeboah',
    role: 'Chair/ Vice President',
    avatarUrl: '/images/home/team/exec-theodora.png',
    continent: 'Africa',
    socialLinks: [{ platform: 'linkedin', url: 'https://linkedin.com' }],
  },
];

const ALLOWED_SOCIAL_PLATFORMS = new Set(['facebook', 'instagram', 'linkedin', 'youtube']);

export function TeamSection() {
  const [leadership, setLeadership] = useState<LeadershipRoster>({
    executives: FALLBACK_EXECUTIVES,
    directors: [],
  });
  const [directorIndex, setDirectorIndex] = useState(0);

  const leaders = leadership.executives.length > 0 ? leadership.executives : FALLBACK_EXECUTIVES;
  const directors = leadership.directors;
  const activeDirector = directors.length > 0 ? directors[directorIndex % directors.length] : null;
  const previewDirectors = directors.slice(0, 5);

  useEffect(() => {
    const controller = new AbortController();
    fetchLeadership({ signal: controller.signal })
      .then((data) => {
        if (data.executives.length > 0 || data.directors.length > 0) {
          setLeadership(data);
        }
      })
      .catch(() => {
        // Fall back gracefully to preset roster
      });
    return () => controller.abort();
  }, []);

  const showPreviousDirector = () => {
    setDirectorIndex((current) => (current - 1 + directors.length) % directors.length);
  };

  const showNextDirector = () => {
    setDirectorIndex((current) => (current + 1) % directors.length);
  };

  return (
    <section className="bg-white pt-12 pb-0 md:pt-16 lg:pt-[7.5rem]">
      <Container className="max-w-[95%] sm:max-w-[85%]">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-[60px]">
          <h2 className="font-semibold text-[clamp(2rem,3.13vw,3rem)] leading-tight" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            The People Behind{' '}
            <span className="bg-gradient-to-r from-[#EE334E] via-[#FBAB1A] to-[#10984F] bg-clip-text text-transparent">
              Y.O.U
            </span>
          </h2>
        </div>

        {/* Executive Leadership */}
        <div className="mb-8 flex flex-col items-center gap-1 lg:mb-[40px]">
          <h3 className="text-center font-semibold text-[clamp(1.5rem,1.82vw,1.75rem)] text-[#111111]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Executive Leadership
          </h3>
          <span className="text-center text-neutral-500" style={{ fontSize: 'clamp(0.875rem, 1.04vw, 1rem)', fontFamily: 'Open Sans, sans-serif' }}>
            Term {currentTermLabel()}
          </span>
        </div>

        <div className="mx-auto grid grid-cols-2 lg:grid-cols-3 justify-items-center gap-x-4 gap-y-8 sm:gap-x-8 lg:max-w-[860px] lg:gap-[24px] mb-8 lg:mb-[40px]">
          {leaders.map((leader) => {
            const allowedSocialLinks = leader.socialLinks?.filter((link) =>
              ALLOWED_SOCIAL_PLATFORMS.has(link.platform)
            );
            const hasSocial = Boolean(allowedSocialLinks && allowedSocialLinks.length > 0);
            const isPresident = /president/i.test(leader.role) && !/vice/i.test(leader.role);
            return (
              <div
                key={leader.id}
                className={`flex flex-col items-center max-w-[280px] ${
                  isPresident ? 'col-span-2 -order-1 lg:order-none lg:col-span-1' : ''
                }`}
              >
                <div className="mb-4 flex items-end justify-center w-44 h-44 sm:w-60 sm:h-60 lg:w-[280px] lg:h-[280px]">
                  <div
                    className={`relative flex-shrink-0 group cursor-pointer ${
                      isPresident
                        ? 'w-44 h-44 sm:w-60 sm:h-60 lg:w-[280px] lg:h-[280px]'
                        : 'w-40 h-40 sm:w-52 sm:h-52 lg:w-[240px] lg:h-[240px]'
                    }`}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#EEEEEE]">
                      <ImageWithFallback
                        src={leader.avatarUrl || '/images/home/team/exec-safin.png'}
                        alt={leader.name}
                        className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-50"
                      />
                    </div>
                    {hasSocial && (
                      <div className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex gap-3">
                          {allowedSocialLinks!.map((link) => (
                            <a
                              key={link.platform}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={link.platform}
                              onClick={(e) => e.stopPropagation()}
                              className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform"
                            >
                              <Icon name={ICONS[link.platform]} size={16} color={SOCIAL_COLORS[link.platform]} />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <h4 className="font-semibold text-[clamp(1rem,1.30vw,1.25rem)] text-[#111111] text-center" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                  {leader.name}
                </h4>
                <p className="text-[clamp(0.875rem,1.04vw,1rem)] text-neutral-500 text-center" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                  {leader.role}
                </p>
              </div>
            );
          })}
        </div>

        {directors.length > 0 && (
          <>
            <hr className="border-neutral-200 my-10 lg:my-[60px]" />

            {/* Continental Directors */}
            <div className="flex flex-col items-center gap-1 mb-8 lg:mb-[40px]">
              <h3 className="text-center font-semibold text-[clamp(1.5rem,1.82vw,1.75rem)] text-[#111111]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                Continental Directors
              </h3>
              <span className="text-center text-neutral-500" style={{ fontSize: 'clamp(0.875rem, 1.04vw, 1rem)', fontFamily: 'Open Sans, sans-serif' }}>
                Term {currentTermLabel()}
              </span>
            </div>

            {/* Mobile View */}
            {activeDirector && (
              <div className="flex flex-col items-center mb-10 lg:hidden">
                <div className="flex items-center justify-center gap-4 sm:gap-6">
                  <button
                    type="button"
                    onClick={showPreviousDirector}
                    aria-label="Previous director"
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#EE334E] text-[#EE334E] transition-colors hover:bg-[#EE334E] hover:text-white sm:h-10 sm:w-10 cursor-pointer"
                  >
                    <Icon name="lucide:chevron-left" size={20} />
                  </button>
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-[#EEEEEE] relative group cursor-pointer transition-all duration-300">
                    <ImageWithFallback
                      src={activeDirector.avatarUrl || '/images/home/about/ambassador-2.jpg'}
                      alt={activeDirector.name}
                      className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-50"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={showNextDirector}
                    aria-label="Next director"
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#EE334E] text-[#EE334E] transition-colors hover:bg-[#EE334E] hover:text-white sm:h-10 sm:w-10 cursor-pointer"
                  >
                    <Icon name="lucide:chevron-right" size={20} />
                  </button>
                </div>
                <div className="mt-3 flex max-w-[220px] flex-col items-center">
                  <h4 className="font-semibold text-base text-[#111111] text-center" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                    {activeDirector.name}
                  </h4>
                  <p className="text-sm text-neutral-500 text-center" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                    {activeDirector.role}
                  </p>
                </div>
              </div>
            )}

            {/* Desktop Grid */}
            <div className="hidden lg:grid grid-cols-3 xl:grid-cols-5 justify-items-center gap-[32px] mb-[60px]">
              {previewDirectors.map((dir) => (
                <div key={dir.id} className="flex flex-col items-center max-w-[200px]">
                  <div className="w-[180px] h-[180px] rounded-full overflow-hidden mb-3 relative group cursor-pointer bg-[#EEEEEE]">
                    <ImageWithFallback
                      src={dir.avatarUrl || '/images/home/about/ambassador-2.jpg'}
                      alt={dir.name}
                      className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-50"
                    />
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

            <div className="flex justify-center">
              <ViewAllButton to={ROUTES.LEADERSHIP} />
            </div>
          </>
        )}
      </Container>
    </section>
  );
}