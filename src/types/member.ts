import type { SocialLink, GalleryImage } from './common';

export type Continent =
  | 'Asia'
  | 'Africa'
  | 'America'
  | 'Australia'
  | 'Europe';

export interface Member {
  id: string;
  name: string;
  logoUrl: string;
  coverUrl?: string;
  shortDescription: string;
  description: string;
  country: string;
  continent: Continent;
  focusSdgs: number[];
  socialLinks: SocialLink[];
  projectIds: string[];
  gallery: GalleryImage[];
  donationQrUrl?: string;
  period?: string;
  leader?: string;
}
