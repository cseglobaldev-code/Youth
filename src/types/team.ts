import type { SocialLink } from './common';
import type { Continent } from './member';

export type RegionGroup =
  | 'East Asia'
  | 'Southeast Asia'
  | 'South Asia'
  | 'Central Asia'
  | 'West Asia'
  | 'North Asia'
  | 'Africa'
  | 'America'
  | 'Australia'
  | 'Europe';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  continent: Continent;
  regionGroup?: RegionGroup;
  socialLinks?: SocialLink[];
}
