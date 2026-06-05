import type { TeamMember } from '@/types';

const MEMBER_SOCIAL = [
  { platform: 'facebook' as const, url: '#' },
  { platform: 'linkedin' as const, url: '#' },
  { platform: 'tiktok' as const, url: '#' },
];

const EXEC_SOCIAL = MEMBER_SOCIAL;

export const EXECUTIVE_LEADERSHIP: TeamMember[] = [
  {
    id: 'exec-1',
    name: 'Safeen H. Mohammed',
    role: 'President & Chair',
    avatarUrl: '/images/leadership/exec-1.png',
    continent: 'Asia',
    socialLinks: EXEC_SOCIAL,
  },
  {
    id: 'exec-2',
    name: 'Sophie Martin',
    role: 'Vice Chairman',
    avatarUrl: '/images/leadership/exec-2.png',
    continent: 'Europe',
    socialLinks: EXEC_SOCIAL,
  },
  {
    id: 'exec-3',
    name: 'Emily Nguyen',
    role: 'President & Chair',
    avatarUrl: '/images/leadership/exec-3.png',
    continent: 'Asia',
    socialLinks: EXEC_SOCIAL,
  },
];

export const TEAM_DATA: TeamMember[] = [
  // Asia — East Asia
  {
    id: 'dir-ea-1', name: 'Yuki Tanaka', role: 'Director, East Asia',
    avatarUrl: '/images/leadership/director-1.png', continent: 'Asia', regionGroup: 'East Asia', socialLinks: MEMBER_SOCIAL,
  },
  {
    id: 'dir-ea-2', name: 'Li Wei', role: 'Deputy Director, East Asia',
    avatarUrl: '/images/leadership/director-2.png', continent: 'Asia', regionGroup: 'East Asia', socialLinks: MEMBER_SOCIAL,
  },
  {
    id: 'dir-ea-3', name: 'Kim Jae-won', role: 'Programs Lead, East Asia',
    avatarUrl: '/images/leadership/director-3.png', continent: 'Asia', regionGroup: 'East Asia', socialLinks: MEMBER_SOCIAL,
  },
  {
    id: 'dir-ea-4', name: 'Haruto Sato', role: 'Communications, East Asia',
    avatarUrl: '/images/leadership/director-4.png', continent: 'Asia', regionGroup: 'East Asia', socialLinks: MEMBER_SOCIAL,
  },
  {
    id: 'dir-ea-5', name: 'Mei Lin', role: 'Partnerships, East Asia',
    avatarUrl: '/images/leadership/director-5.png', continent: 'Asia', regionGroup: 'East Asia', socialLinks: MEMBER_SOCIAL,
  },
  // Asia — Southeast Asia
  {
    id: 'dir-sea-1', name: 'Nguyen Van A', role: 'Director, Southeast Asia',
    avatarUrl: '/images/team/team-1.jpg', continent: 'Asia', regionGroup: 'Southeast Asia', socialLinks: MEMBER_SOCIAL,
  },
  // Africa
  {
    id: 'dir-af-1', name: 'Amara Okafor', role: 'Director, Africa',
    avatarUrl: '/images/team/team-2.jpg', continent: 'Africa', regionGroup: 'Africa', socialLinks: MEMBER_SOCIAL,
  },
  // America
  {
    id: 'dir-am-1', name: 'Maria Santos', role: 'Director, America',
    avatarUrl: '/images/team/team-3.jpg', continent: 'America', regionGroup: 'America', socialLinks: MEMBER_SOCIAL,
  },
  // Europe
  {
    id: 'dir-eu-1', name: 'Hans Mueller', role: 'Director, Europe',
    avatarUrl: '/images/team/team-4.jpg', continent: 'Europe', regionGroup: 'Europe', socialLinks: MEMBER_SOCIAL,
  },
  // Australia
  {
    id: 'dir-au-1', name: 'Sarah Johnson', role: 'Director, Australia',
    avatarUrl: '/images/team/team-6.jpg', continent: 'Australia', regionGroup: 'Australia', socialLinks: MEMBER_SOCIAL,
  },
];
