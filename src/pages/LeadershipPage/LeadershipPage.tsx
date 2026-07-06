// src/pages/LeadershipPage/LeadershipPage.tsx
import { useState, useMemo, useEffect } from 'react';
import { Spin } from 'antd';
import { Container } from '@/components/ui/Container';
import { ExecutiveCard } from '@/components/common/ExecutiveCard';
import { TeamMemberCard } from '@/components/common/TeamMemberCard';
import { LeaderMemberModal } from '@/components/common/LeaderMemberModal';
import { CTABanner } from '@/components/common/CTABanner';
import { cn } from '@/lib/utils';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useJoinNavigation } from '@/hooks';
import { StrapiService } from '@/lib/strapi';
import type { Continent, RegionGroup, TeamMember } from '@/types';

const CONTINENTS: Continent[] = ['Asia', 'Africa', 'America', 'Australia', 'Europe'];

const ASIA_REGIONS: RegionGroup[] = [
  'East Asia',
  'Southeast Asia',
  'South Asia',
  'Central Asia',
  'West Asia',
  'North Asia',
];

const HERO_GRADIENT = 'linear-gradient(90deg, #EE334E 0%, #FCB131 33%, #00A651 67%, #0081C8 100%)';
const SEPARATOR_GRADIENT =
  'linear-gradient(90deg, rgba(194,211,239,0) 0%, rgba(194,211,239,1) 20%, rgba(194,211,239,1) 80%, rgba(194,211,239,0) 100%)';

export function LeadershipPage() {
  const [allTeamMembers, setAllTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeContinent, setActiveContinent] = useState<Continent>('Asia');
  const [activeRegion, setActiveRegion] = useState<RegionGroup>('East Asia');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showAllDirectors, setShowAllDirectors] = useState(false);

  const goToJoin = useJoinNavigation();

  const openModal = (member: TeamMember) => setSelectedMember(member);
  const closeModal = () => setSelectedMember(null);

  const { ref: heroRef, visible: heroVisible } = useScrollReveal(0.05);
  const { ref: execRef, visible: execVisible } = useScrollReveal(0.05);
  const { ref: directorsRef, visible: directorsVisible } = useScrollReveal(0.05);

  useEffect(() => {
    StrapiService.getTeamMembers()
      .then((data) => {
        setAllTeamMembers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Không thể tải thông tin đội ngũ lãnh đạo.');
        setLoading(false);
      });
  }, []);

  const executives = useMemo(() => {
    return allTeamMembers.filter((m) => m.role !== 'Continental Director');
  }, [allTeamMembers]);

  const filteredDirectors = useMemo(() => {
    const directors = allTeamMembers.filter((m) => m.role === 'Continental Director');
    if (activeContinent === 'Asia') {
      return directors.filter(
        (m) => m.continent === 'Asia' && m.regionGroup === activeRegion
      );
    }
    return directors.filter((m) => m.continent === activeContinent);
  }, [allTeamMembers, activeContinent, activeRegion]);

  const visibleDirectors = showAllDirectors ? filteredDirectors : filteredDirectors.slice(0, 5);
  const hasMoreDirectors = filteredDirectors.length > visibleDirectors.length;

  const handleContinentChange = (continent: Continent) => {
    setActiveContinent(continent);
    if (continent === 'Asia') setActiveRegion('East Asia');
    setShowAllDirectors(false);
  };

  const handleRegionChange = (region: RegionGroup) => {
    setActiveRegion(region);
    setShowAllDirectors(false);
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Spin size="large" tip="Đang tải danh sách đội ngũ..." />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-20 text-center text-red-500">
        <p>{error}</p>
      </Container>
    );
  }

  return (
    <div>
      <Container>
        <div className="flex flex-col items-center gap-[60px] lg:gap-[80px] pt-10 lg:pt-[80px] pb-10 lg:pb-[80px]">
          <div
            ref={heroRef as React.RefObject<HTMLDivElement>}
            className={cn(
              'flex flex-col items-center gap-[24px] w-full transition-all duration-700',
              heroVisible ? 'animate-fade-in-up' : 'opacity-0'
            )}
          >
            <div className="flex flex-wrap justify-center items-center gap-[16px] lg:gap-[24px]">
              <span
                className="font-semibold text-black"
                style={{
                  fontSize: 'clamp(2.5rem, 4.17vw, 80px)',
                  lineHeight: '110%',
                  fontFamily: 'Open Sans, sans-serif',
                }}
              >
                The People Behind
              </span>
              <span
                className="font-semibold bg-clip-text text-transparent"
                style={{
                  fontSize: 'clamp(2.5rem, 4.17vw, 80px)',
                  lineHeight: '110%',
                  fontFamily: 'Open Sans, sans-serif',
                  backgroundImage: HERO_GRADIENT,
                }}
              >
                Y.O.U
              </span>
            </div>

            <p
              className="text-center font-normal text-black"
              style={{
                fontSize: 'clamp(0.9375rem, 1.35vw, 26px)',
                lineHeight: '140%',
                fontFamily: 'Open Sans, sans-serif',
                maxWidth: '1120px',
              }}
            >
              Youth Organization Union brings together youth-led organizations across continents to drive sustainable development.
            </p>
          </div>

          <div
            ref={execRef as React.RefObject<HTMLDivElement>}
            className={cn(
              'flex flex-col items-center gap-[40px] w-full transition-all duration-700',
              execVisible ? 'animate-fade-in-up' : 'opacity-0'
            )}
          >
            <div className="flex flex-col items-center gap-[4px]">
              <span
                className="text-black font-normal"
                style={{
                  fontSize: 'clamp(1.25rem, 1.67vw, 32px)',
                  lineHeight: '140%',
                  fontFamily: 'Open Sans, sans-serif',
                }}
              >
                2020 - 2026
              </span>
              <h2
                className="font-semibold text-black"
                style={{
                  fontSize: 'clamp(1.5rem, 2.08vw, 2.5rem)',
                  lineHeight: '140%',
                  fontFamily: 'Open Sans, sans-serif',
                }}
              >
                Executive Leadership
              </h2>
            </div>

            <div className="flex flex-wrap lg:flex-nowrap justify-center lg:justify-between items-center gap-10 lg:gap-0 w-full lg:max-w-[828px] mx-auto">
              {executives.map((member, index) => (
                <div
                  key={member.id}
                  className={cn(execVisible ? 'animate-fade-in-up' : 'opacity-0')}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ExecutiveCard member={member} onClick={() => openModal(member)} />
                </div>
              ))}
            </div>
          </div>

          <div className="w-full" style={{ height: '1px', background: SEPARATOR_GRADIENT }} />
        </div>
      </Container>

      <div
        ref={directorsRef as React.RefObject<HTMLDivElement>}
        className={cn(
          'flex flex-col items-center gap-[40px] lg:gap-[60px] w-full py-10 lg:py-[80px] transition-all duration-700',
          directorsVisible ? 'animate-fade-in-up' : 'opacity-0'
        )}
      >
        <Container className="flex flex-col items-center gap-[40px]">
          <h2
            className="font-semibold text-black text-center"
            style={{
              fontSize: 'clamp(1.5rem, 2.08vw, 2.5rem)',
              lineHeight: '140%',
              fontFamily: 'Open Sans, sans-serif',
            }}
          >
            Continental Directors
          </h2>

          <div className="flex flex-col items-stretch gap-[24px] w-full">
            <div className="flex flex-wrap justify-center gap-3 lg:gap-[24px]">
              {CONTINENTS.map((continent) => (
                <button
                  key={continent}
                  onClick={() => handleContinentChange(continent)}
                  className={cn(
                    'font-semibold rounded-full transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] whitespace-nowrap',
                    activeContinent === continent
                      ? 'bg-[#1771B9] text-white'
                      : 'bg-[#E3F2FD] text-[#151515]'
                  )}
                  style={{
                    fontSize: 'clamp(0.875rem, 1.15vw, 22px)',
                    lineHeight: '140%',
                    fontFamily: 'Open Sans, sans-serif',
                    padding: 'clamp(10px, 0.83vw, 16px) clamp(18px, 1.67vw, 32px)',
                  }}
                >
                  {continent}
                </button>
              ))}
            </div>

            {activeContinent === 'Asia' && (
              <div className="flex flex-wrap justify-center gap-4 lg:gap-[40px]">
                {ASIA_REGIONS.map((region) => (
                  <button
                    key={region}
                    onClick={() => handleRegionChange(region)}
                    className={cn(
                      'font-semibold transition-colors duration-200',
                      activeRegion === region
                        ? 'text-[#1771B9] border-b border-[#1771B9]'
                        : 'text-black border-b border-transparent'
                    )}
                    style={{
                      fontSize: 'clamp(0.875rem, 1.15vw, 22px)',
                      lineHeight: '140%',
                      fontFamily: 'Open Sans, sans-serif',
                      padding: 'clamp(8px, 0.83vw, 16px) 0',
                    }}
                  >
                    {region}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Container>

        {visibleDirectors.length > 0 ? (
          <>
            <Container className={cn(
              'w-full gap-[24px] lg:gap-[32px]',
              visibleDirectors.length >= 5
                ? 'grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5'
                : 'flex flex-wrap justify-center'
            )}>
              {visibleDirectors.map((member, index) => (
                <div
                  key={member.id}
                  className={cn(directorsVisible ? 'animate-fade-in-up' : 'opacity-0')}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <TeamMemberCard
                    member={member}
                    avatarSize="4xl"
                    className="w-full"
                    onClick={() => openModal(member)}
                  />
                </div>
              ))}
            </Container>

            {hasMoreDirectors && (
              <button
                type="button"
                className="rounded-full bg-[#1771B9] px-8 py-3 font-semibold text-white transition hover:bg-[#125f9d] active:scale-[0.98]"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
                onClick={() => setShowAllDirectors(true)}
              >
                View All
              </button>
            )}
          </>
        ) : (
          <p
            className="text-black py-16 text-center"
            style={{ opacity: 0.5, fontFamily: 'Open Sans, sans-serif', fontSize: '1.125rem' }}
          >
            No directors listed for this region yet.
          </p>
        )}
      </div>

      <CTABanner
        title="Ready to Make an Impact?"
        description="Join thousands of youth leaders across ASEAN who are making a difference in their communities."
        ctaLabel="Register Now"
        onCtaClick={goToJoin}
      />

      <LeaderMemberModal
        member={selectedMember}
        open={selectedMember !== null}
        onClose={closeModal}
      />
    </div>
  );
}