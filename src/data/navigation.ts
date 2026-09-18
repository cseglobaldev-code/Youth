import type { NavItem, SocialLink } from '@/types';
import { ROUTES } from '@/routes/paths';

export const NAV_ITEMS: NavItem[] = [
  { label: 'About us', path: ROUTES.ABOUT },
  { label: 'Leadership', path: ROUTES.LEADERSHIP },
  { label: 'Members', path: ROUTES.MEMBERS },
  { label: 'Projects', path: ROUTES.PROJECTS },
  { label: 'Document', path: ROUTES.POLICY_DOCUMENTS },
  { label: 'Contact', path: ROUTES.CONTACT },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { platform: 'facebook', url: 'https://www.facebook.com/UnionofYouth' },
  { platform: 'instagram', url: 'https://www.instagram.com/youthorgunion/' },
  { platform: 'linkedin', url: 'https://www.linkedin.com/company/unionofyouth/posts/?feedView=all' },
  { platform: 'youtube', url: 'https://www.youtube.com/channel/UCddzJhzZYX8A30H_dDYrYog' },
];
