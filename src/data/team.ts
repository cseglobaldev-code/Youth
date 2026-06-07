import type { TeamMember } from '@/types';

const MEMBER_SOCIAL = [
  { platform: 'facebook' as const, url: '#' },
  { platform: 'linkedin' as const, url: '#' },
  { platform: 'tiktok' as const, url: '#' },
];

const EXEC_SOCIAL = MEMBER_SOCIAL;

/**
 * Single source of truth for the people shown on BOTH the homepage
 * `TeamSection` (dashboard) and the `/leadership` page. Names + roles mirror
 * the dashboard, which is the canonical reference.
 */
export const EXECUTIVE_LEADERSHIP: TeamMember[] = [
  {
    id: 'exec-1',
    name: 'Minh Anh Nguyen',
    role: 'President & Chair',
    avatarUrl: '/images/leadership/exec-1.png',
    continent: 'Asia',
    socialLinks: EXEC_SOCIAL,
  },
  {
    id: 'exec-2',
    name: 'Safeen H. Mohammed',
    role: 'Vice President',
    avatarUrl: '/images/leadership/exec-2.png',
    continent: 'Asia',
    socialLinks: EXEC_SOCIAL,
  },
  {
    id: 'exec-3',
    name: 'Muhammad Younas',
    role: 'Secretary General',
    avatarUrl: '/images/leadership/exec-3.png',
    continent: 'Asia',
    socialLinks: EXEC_SOCIAL,
  },
];

/**
 * Continental Directors — one canonical list consumed by the dashboard
 * showcase and the `/leadership` continent/region filter.
 */
export const TEAM_DATA: TeamMember[] = [
  {
    id: 'dir-eu-1', name: 'Sophie Martin', role: 'Continental Director',
    avatarUrl: '/images/leadership/director-1.png', continent: 'Europe', regionGroup: 'Europe', socialLinks: MEMBER_SOCIAL,
  },
  {
    id: 'dir-as-1', name: 'Yuki Tanaka', role: 'Continental Director',
    avatarUrl: '/images/leadership/director-2.png', continent: 'Asia', regionGroup: 'East Asia', socialLinks: MEMBER_SOCIAL,
  },
  {
    id: 'dir-au-1', name: 'Sarah Johnson', role: 'Continental Director',
    avatarUrl: '/images/leadership/director-3.png', continent: 'Australia', regionGroup: 'Australia', socialLinks: MEMBER_SOCIAL,
  },
  {
    id: 'dir-af-1', name: 'Amara Okafor', role: 'Continental Director',
    avatarUrl: '/images/leadership/director-4.png', continent: 'Africa', regionGroup: 'Africa', socialLinks: MEMBER_SOCIAL,
  },
  {
    id: 'dir-eu-2', name: 'Hans Mueller', role: 'Continental Director',
    avatarUrl: '/images/leadership/director-5.png', continent: 'Europe', regionGroup: 'Europe', socialLinks: MEMBER_SOCIAL,
  },
];
