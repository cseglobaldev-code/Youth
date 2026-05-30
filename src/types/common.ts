export type SocialPlatform =
  | 'youtube'
  | 'facebook'
  | 'twitter'
  | 'instagram'
  | 'linkedin';

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

export interface NavItem {
  label: string;
  path: string;
  children?: NavItem[];
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}
