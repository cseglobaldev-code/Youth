import type { SocialLink } from './common';
import type { Continent } from './member';

export type RegionGroup =
  | 'East Asia'
  | 'Southeast Asia'
  | 'South Asia'
  | 'Central Asia'
  | 'West Asia'
  | 'North Asia'
  | 'North Africa'
  | 'West Africa'
  | 'Central Africa'
  | 'East Africa'
  | 'Southern Africa'
  | 'North America'
  | 'Central America'
  | 'Caribbean'
  | 'South America'
  | 'Australia'
  | 'New Zealand'
  | 'Melanesia'
  | 'Micronesia'
  | 'Polynesia'
  | 'Northern Europe'
  | 'Western Europe'
  | 'Eastern Europe'
  | 'Southern Europe';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  continent: Continent;
  regionGroup?: RegionGroup;
  socialLinks?: SocialLink[];
  bio?: string[];
  focusSdgs?: number[];
  year?: string;
  activityImages?: string[];
}
