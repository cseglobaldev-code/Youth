import type { TeamMember } from '@/types';

export const TEAM_DATA: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Nguyen Van A',
    role: 'President',
    avatarUrl: '/images/team/team-1.jpg',
    continent: 'Asia',
    regionGroup: 'Southeast Asia',
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/nguyenvana' },
    ],
  },
  {
    id: 'team-2',
    name: 'Amara Okafor',
    role: 'Vice President',
    avatarUrl: '/images/team/team-2.jpg',
    continent: 'Africa',
    regionGroup: 'Africa',
    socialLinks: [
      { platform: 'twitter', url: 'https://twitter.com/amaraokafor' },
    ],
  },
  {
    id: 'team-3',
    name: 'Maria Santos',
    role: 'Secretary General',
    avatarUrl: '/images/team/team-3.jpg',
    continent: 'America',
    regionGroup: 'America',
  },
  {
    id: 'team-4',
    name: 'Hans Mueller',
    role: 'Continental Director - Europe',
    avatarUrl: '/images/team/team-4.jpg',
    continent: 'Europe',
    regionGroup: 'Europe',
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/hansmueller' },
    ],
  },
  {
    id: 'team-5',
    name: 'Yuki Tanaka',
    role: 'Continental Director - East Asia',
    avatarUrl: '/images/team/team-5.jpg',
    continent: 'Asia',
    regionGroup: 'East Asia',
  },
  {
    id: 'team-6',
    name: 'Sarah Johnson',
    role: 'Continental Director - Australia',
    avatarUrl: '/images/team/team-6.jpg',
    continent: 'Australia',
    regionGroup: 'Australia',
  },
];
