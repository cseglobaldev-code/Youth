// src/components/sections/home/TeamSection.tsx
import { useState, useEffect, useMemo } from 'react';
import { Spin } from 'antd';
import { Container } from '@/components/ui/Container';
import { ExecutiveCard } from '@/components/common/ExecutiveCard';
import { TeamMemberCard } from '@/components/common/TeamMemberCard';
import { LeaderMemberModal } from '@/components/common/LeaderMemberModal';
import { StrapiService } from '@/lib/strapi';
import { EXECUTIVE_LEADERSHIP, TEAM_DATA } from '@/data';
import type { TeamMember } from '@/types';

export function TeamSection() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    StrapiService.getTeamMembers()
      .then((data) => {
        if (data && data.length > 0) {
          setTeamMembers(data);
        } else {
          setTeamMembers([...EXECUTIVE_LEADERSHIP, ...TEAM_DATA]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('API failed, falling back to static team data:', err);
        setTeamMembers([...EXECUTIVE_LEADERSHIP, ...TEAM_DATA]);
        setLoading(false);
      });
  }, []);

  const executives = useMemo(() => {
    return teamMembers.filter((m) => m.role !== 'Continental Director');
  }, [teamMembers]);

  const directors = useMemo(() => {
    return teamMembers.filter((m) => m.role === 'Continental Director');
  }, [teamMembers]);

  const [directorIndex, setDirectorIndex] = useState(0);
  const activeDirector = directors[directorIndex];

  useEffect(() => {
    if (directors.length === 0) return;
    const interval = setInterval(() => {
      setDirectorIndex((current) => (current + 1) % directors.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [directors]);

  if (loading) {
    return (
      <div className="py-20 text-center bg-white">
        <Spin size="large" tip="Đang tải danh sách..." />
      </div>
    );
  }

  return (
    <section className="bg-white py-0">
      <Container size="wide">
        <div className="text-center mb-8 md:mb-12 lg:mb-[60px]">
          <h2 className="font-semibold text-[clamp(1.5rem,3.13vw,3rem)] leading-tight" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            The People Behind{' '}
            <span className="bg-gradient-to-r from-[#E42C27] via-[#FBAB1A] to-[#10984F] bg-clip-text text-transparent">
              Y.O.U
            </span>
          </h2>
        </div>

        {executives.length > 0 && (
          <>
            <h3 className="mb-8 text-center font-semibold text-[clamp(1.25rem,1.82vw,1.75rem)] text-[#111111] lg:mb-[40px]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              Executive Leadership 2026 - 2027
            </h3>
            <div className="mx-auto grid grid-cols-2 lg:grid-cols-3 justify-items-center gap-x-4 gap-y-8 sm:gap-x-8 lg:max-w-[860px] lg:gap-[24px] mb-8 lg:mb-[40px]">
              {executives.map((leader) => (
                <div key={leader.id} className="flex flex-col items-center max-w-[280px]">
                  <ExecutiveCard member={leader} onClick={() => setSelectedMember(leader)} />
                </div>
              ))}
            </div>
          </>
        )}

        {directors.length > 0 && (
          <>
            <hr className="border-neutral-200 my-10 lg:my-[60px]" />
            <div className="text-center mb-8 lg:mb-[40px]">
              <h3 className="font-semibold text-[clamp(1.5rem,1.82vw,1.75rem)] text-[#111111]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                Continental Directors
              </h3>
            </div>

            {activeDirector && (
              <div className="flex flex-col items-center mb-10">
                <TeamMemberCard
                  member={activeDirector}
                  avatarSize="3xl"
                  onClick={() => setSelectedMember(activeDirector)}
                />
              </div>
            )}
          </>
        )}
      </Container>

      <LeaderMemberModal
        member={selectedMember}
        open={selectedMember !== null}
        onClose={() => setSelectedMember(null)}
      />
    </section>
  );
}
