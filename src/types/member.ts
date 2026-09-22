import type { SocialLink, GalleryImage } from './common';

export type Continent =
  | 'Asia'
  | 'Africa'
  | 'America'
  | 'Australia'
  | 'Europe';

export interface MemberPerson {
  prefix?: string;
  fullName?: string;
  title?: string;
  email?: string;
  phone?: string;
}

export function formatMemberPerson(person?: MemberPerson): string {
  if (!person) return '';
  const prefix = person.prefix?.trim();
  const prefixText = prefix ? `${prefix.replace(/\.+$/, '')}.` : '';
  const name = [prefixText, person.fullName?.trim()].filter(Boolean).join(' ');
  const title = person.title?.trim() || '';
  return name && title ? `${name}, ${title}` : name || title;
}

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
  /** Local fixture compatibility; CMS members use representative. */
  leader?: string;
  representative?: MemberPerson;
  contactPerson?: MemberPerson;
}
