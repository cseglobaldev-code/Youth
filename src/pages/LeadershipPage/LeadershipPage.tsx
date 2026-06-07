import { useState, useMemo } from 'react';
import { Container } from '@/components/ui/Container';
import { ExecutiveCard } from '@/components/common/ExecutiveCard';
import { TeamMemberCard } from '@/components/common/TeamMemberCard';
import { CTABanner } from '@/components/common/CTABanner';
import { EXECUTIVE_LEADERSHIP, TEAM_DATA } from '@/data';
import { cn } from '@/lib/utils';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { Continent, RegionGroup } from '@/types';


/* ─── constants ─────────────────────────────────────────────────────────── */

const CONTINENTS: Continent[] = ['Asia', 'Africa', 'America', 'Australia', 'Europe'];

const ASIA_REGIONS: RegionGroup[] = [
  'East Asia',
  'Southeast Asia',
  'South Asia',
  'Central Asia',
  'West Asia',
  'North Asia',
];

const HERO_GRADIENT =
  'linear-gradient(90deg, #EE334E 0%, #FCB131 33%, #00A651 67%, #0081C8 100%)';
const SEPARATOR_GRADIENT =
  'linear-gradient(90deg, rgba(194,211,239,0) 0%, rgba(194,211,239,1) 20%, rgba(194,211,239,1) 80%, rgba(194,211,239,0) 100%)';

/* ─── component ─────────────────────────────────────────────────────────── */

export function LeadershipPage() {
  const [activeContinent, setActiveContinent] = useState<Continent>('Asia');
  const [activeRegion, setActiveRegion] = useState<RegionGroup>('East Asia');

  const { ref: heroRef, visible: heroVisible } = useScrollReveal(0.05);
  const { ref: execRef, visible: execVisible } = useScrollReveal(0.05);
  const { ref: directorsRef, visible: directorsVisible } = useScrollReveal(0.05);

  const filteredMembers = useMemo(() => {
    if (activeContinent === 'Asia') {
      return TEAM_DATA.filter(
        (m) => m.continent === 'Asia' && m.regionGroup === activeRegion
      );
    }
    return TEAM_DATA.filter((m) => m.continent === activeContinent);
  }, [activeContinent, activeRegion]);

  const handleContinentChange = (continent: Continent) => {
    setActiveContinent(continent);
    if (continent === 'Asia') setActiveRegion('East Asia');
  };

  return (
    <div>
      <Container>
          <div className="flex flex-col items-center gap-[60px] lg:gap-[80px] pt-10 lg:pt-[80px] pb-10 lg:pb-[80px]">

            {/* ══════════════════════════════════════════════════
                1. HERO  (Frame 114 → Frame 117 → Frame 121)
                   row, justifyContent:center, gap:24px
            ══════════════════════════════════════════════════ */}
            <div
              ref={heroRef as React.RefObject<HTMLDivElement>}
              className={cn(
                'flex flex-col items-center gap-[24px] w-full transition-all duration-700',
                heroVisible ? 'animate-fade-in-up' : 'opacity-0'
              )}
            >
              {/* Title row — center, gap:24px */}
              <div className="flex flex-wrap justify-center items-center gap-[16px] lg:gap-[24px]">
                <span
                  className="font-semibold text-black"
                  style={{
                    fontSize: 'clamp(2.5rem, 4.17vw, 5rem)',
                    lineHeight: '110%',
                    fontFamily: 'Open Sans, sans-serif',
                  }}
                >
                  The People Behind
                </span>
                <span
                  className="font-semibold bg-clip-text text-transparent"
                  style={{
                    fontSize: 'clamp(2.5rem, 4.17vw, 5rem)',
                    lineHeight: '110%',
                    fontFamily: 'Open Sans, sans-serif',
                    backgroundImage: HERO_GRADIENT,
                  }}
                >
                  Y.O.U
                </span>
              </div>

              {/* Description — fixed width 1120px in Figma → max-w here */}
              <p
                className="font-normal text-black text-center"
                style={{
                  fontSize: 'clamp(1rem, 1.35vw, 1.625rem)',
                  lineHeight: '140%',
                  fontFamily: 'Open Sans, sans-serif',
                  maxWidth: '780px',
                }}
              >
                Youth Organization Union brings together youth-led organizations across continents
                to drive sustainable development, global diplomacy, and meaningful change.
              </p>
            </div>

            {/* ══════════════════════════════════════════════════
                2. EXECUTIVE LEADERSHIP
                   Frame 112: column, alignItems:center, gap:40px, width:1344
                   Frame 2071857672 (badge): column, center, gap:4px
                   Frame 41 (cards): row, space-between, center, width:828
            ══════════════════════════════════════════════════ */}
            <div
              ref={execRef as React.RefObject<HTMLDivElement>}
              className={cn(
                'flex flex-col items-center gap-[40px] w-full transition-all duration-700',
                execVisible ? 'animate-fade-in-up' : 'opacity-0'
              )}
            >
              {/* Badge + heading — column, center, gap:4px */}
              <div className="flex flex-col items-center gap-[4px]">
                <span
                  className="text-black font-normal"
                  style={{
                    fontSize: '32px',
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

              {/* Cards — row, space-between, center, width:828px, centered via mx-auto */}
              <div className="flex flex-wrap lg:flex-nowrap justify-center lg:justify-between items-center gap-10 lg:gap-0 w-full lg:max-w-[828px] mx-auto">
                {EXECUTIVE_LEADERSHIP.map((member, index) => (
                  <div
                    key={member.id}
                    className={cn(execVisible ? 'animate-fade-in-up' : 'opacity-0')}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ExecutiveCard member={member} />
                  </div>
                ))}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                3. SEPARATOR — gradient stroke line
            ══════════════════════════════════════════════════ */}
            <div className="w-full" style={{ height: '1px', background: SEPARATOR_GRADIENT }} />

            {/* ══════════════════════════════════════════════════
                4. CONTINENTAL DIRECTORS
                   Outer: column, center, gap:60px, alignSelf:stretch
                   Header area (Frame 2071857647): column, center, gap:40px, width:1114
                   Cards row (Frame 2071857648): row, center, gap:32px, alignSelf:stretch
            ══════════════════════════════════════════════════ */}
            <div
              ref={directorsRef as React.RefObject<HTMLDivElement>}
              className={cn(
                'flex flex-col items-center gap-[40px] lg:gap-[60px] w-full transition-all duration-700',
                directorsVisible ? 'animate-fade-in-up' : 'opacity-0'
              )}
            >
              {/* Header + tabs — max-width 1114px, column, center, gap:40px */}
              <div className="flex flex-col items-center gap-[40px] w-full max-w-[1114px]">
                {/* Heading */}
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

                {/* Filter tabs — column, gap:24px */}
                <div className="flex flex-col items-stretch gap-[24px] w-full">

                  {/* Continent pills — row, center, gap:24px, padding:16px 32px each */}
                  <div className="flex flex-wrap justify-center gap-3 lg:gap-[24px]">
                    {CONTINENTS.map((continent) => (
                      <button
                        key={continent}
                        onClick={() => handleContinentChange(continent)}
                        className={cn(
                          'font-semibold rounded-full transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]',
                          activeContinent === continent
                            ? 'bg-[#1771B9] text-white'
                            : 'bg-[#E3F2FD] text-[#151515]'
                        )}
                        style={{
                          fontSize: '22px',
                          lineHeight: '140%',
                          fontFamily: 'Open Sans, sans-serif',
                          padding: '16px 32px',
                        }}
                      >
                        {continent}
                      </button>
                    ))}
                  </div>

                  {/* Sub-region tabs — row, center, gap:40px (only for Asia) */}
                  {activeContinent === 'Asia' && (
                    <div className="flex flex-wrap justify-center gap-4 lg:gap-[40px]">
                      {ASIA_REGIONS.map((region) => (
                        <button
                          key={region}
                          onClick={() => setActiveRegion(region)}
                          className={cn(
                            'font-semibold transition-colors duration-200',
                            activeRegion === region
                              ? 'text-[#1771B9] border-b border-[#1771B9]'
                              : 'text-black border-b border-transparent'
                          )}
                          style={{
                            fontSize: '22px',
                            lineHeight: '140%',
                            fontFamily: 'Open Sans, sans-serif',
                            padding: '16px 0',
                          }}
                        >
                          {region}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Cards row — grid-cols-5 khi đủ người, flex justify-center khi ít */}
              {filteredMembers.length > 0 ? (
                <div className={cn(
                  'w-full gap-[24px] lg:gap-[32px]',
                  filteredMembers.length >= 5
                    ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
                    : 'flex flex-wrap justify-center'
                )}>
                  {filteredMembers.map((member, index) => (
                    <div
                      key={member.id}
                      className={cn(directorsVisible ? 'animate-fade-in-up' : 'opacity-0')}
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      <TeamMemberCard member={member} avatarSize="4xl" className="w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  className="text-black py-16 text-center"
                  style={{ opacity: 0.5, fontFamily: 'Open Sans, sans-serif', fontSize: '1.125rem' }}
                >
                  No directors listed for this region yet.
                </p>
              )}
            </div>
          </div>
        </Container>

        <CTABanner
          title="Ready to Make an Impact?"
          description="Join thousands of youth leaders across ASEAN who are making a difference in their communities."
          ctaLabel="Register Now"
        />
    </div>
  );
}
