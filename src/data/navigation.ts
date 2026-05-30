import type { NavItem, SocialLink } from '@/types';
import { ROUTES } from '@/routes/paths';

export const NAV_ITEMS: NavItem[] = [
  { label: 'About us', path: ROUTES.HOME },
  { label: 'Leadership', path: ROUTES.LEADERSHIP },
  { label: 'Members', path: ROUTES.MEMBERS },
  { label: 'Projects', path: ROUTES.PROJECTS },
  { label: 'Policy', path: ROUTES.POLICY_DOCUMENTS },
  { label: 'Contact', path: '/contact' },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { platform: 'youtube', url: 'https://youtube.com/@you-alliance' },
  { platform: 'facebook', url: 'https://facebook.com/you.alliance' },
  { platform: 'twitter', url: 'https://twitter.com/you_alliance' },
  { platform: 'instagram', url: 'https://instagram.com/you.alliance' },
  { platform: 'linkedin', url: 'https://linkedin.com/company/you-alliance' },
];
