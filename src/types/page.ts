import type { StrapiMedia } from '@/api/strapi';
import type { Project, Member, TeamMember } from '@/types';

export interface SectionStyle {
  background?: 'white' | 'light-blue' | 'dark-navy' | 'rainbow-soft' | 'transparent';
  paddingTop?: 'none' | 'compact' | 'normal' | 'spacious';
  paddingBottom?: 'none' | 'compact' | 'normal' | 'spacious';
  containerWidth?: 'narrow' | 'default' | 'wide' | 'full';
  textAlign?: 'left' | 'center' | 'right';
}

export interface SharedButton {
  label: string;
  url: string;
  variant?: 'solid' | 'outline' | 'white' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isExternal?: boolean;
  target?: '_self' | '_blank';
}

export interface SharedStatItem {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  description?: string;
}

export interface SharedFaqItem {
  question: string;
  answer: string;
}

export interface SharedFeatureItem {
  icon: string;
  title: string;
  description: string;
  active?: boolean;
}

export interface SharedImageTextItem {
  image?: StrapiMedia | null;
  imageUrl?: string;
  title: string;
  description?: string;
}

export interface SEOData {
  metaTitle?: string;
  metaDescription?: string;
  metaImage?: StrapiMedia | null;
  keywords?: string;
  preventIndexing?: boolean;
}

// ── 13 Section Block Interfaces ─────────────────────────────────────────────

export interface HeroBlockData {
  __component: 'sections.hero';
  id: number | string;
  eyebrow?: string;
  title: string;
  highlightTitle?: string;
  description?: string;
  layoutVariant?: 'centered' | 'split-media' | 'video-modal';
  image?: StrapiMedia | null;
  imageUrl?: string;
  youtubeVideoId?: string;
  buttons?: SharedButton[];
  style?: SectionStyle;
}

export interface RichTextBlockData {
  __component: 'sections.rich-text';
  id: number | string;
  title?: string;
  content: any[]; // Strapi v5 Blocks JSON AST
  style?: SectionStyle;
}

export interface MediaTextBlockData {
  __component: 'sections.media-text';
  id: number | string;
  eyebrow?: string;
  title: string;
  content: string;
  media?: StrapiMedia | null;
  mediaUrl?: string;
  mediaPosition?: 'left' | 'right';
  button?: SharedButton;
  style?: SectionStyle;
}

export interface StatsGridBlockData {
  __component: 'sections.stats-grid';
  id: number | string;
  title?: string;
  variant?: 'home' | 'about';
  animated?: boolean;
  items: SharedStatItem[];
  style?: SectionStyle;
}

export interface CTABannerBlockData {
  __component: 'sections.cta-banner';
  id: number | string;
  title: string;
  description?: string;
  ctaLabel: string;
  ctaUrl?: string;
  theme?: 'rainbow-gradient' | 'blue-gradient' | 'solid-brand' | 'white-box';
  hideStar?: boolean;
  style?: SectionStyle;
}

export interface ImageGalleryBlockData {
  __component: 'sections.image-gallery';
  id: number | string;
  title?: string;
  variant?: 'grid' | 'featured';
  images: Array<{ id: string; src: string; alt: string }>;
  columns?: number;
  maxVisible?: number;
  style?: SectionStyle;
}

export interface FaqSectionBlockData {
  __component: 'sections.faq-section';
  id: number | string;
  title: string;
  description?: string;
  useGlobalFaqs?: boolean;
  customFaqs?: SharedFaqItem[];
  showViewAllButton?: boolean;
  style?: SectionStyle;
}

export interface FeaturedProjectsBlockData {
  __component: 'sections.featured-projects';
  id: number | string;
  title?: string;
  subtitle?: string;
  projects?: Project[];
  limit?: number;
  showViewAll?: boolean;
  style?: SectionStyle;
}

export interface FeaturedMembersBlockData {
  __component: 'sections.featured-members';
  id: number | string;
  title?: string;
  subtitle?: string;
  members?: Member[];
  limit?: number;
  showViewAll?: boolean;
  style?: SectionStyle;
}

export interface TeamGridBlockData {
  __component: 'sections.team-grid';
  id: number | string;
  title?: string;
  termLabel?: string;
  teamMembers?: TeamMember[];
  leadershipType?: 'all' | 'executive' | 'continental-director';
  style?: SectionStyle;
}

export interface EmbedBlockData {
  __component: 'sections.embed';
  id: number | string;
  title?: string;
  embedUrl: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
  caption?: string;
  style?: SectionStyle;
}

export interface FeatureGridBlockData {
  __component: 'sections.feature-grid';
  id: number | string;
  eyebrow?: string;
  title: string;
  highlightTitle?: string;
  subtitle?: string;
  columns?: number;
  items: SharedFeatureItem[];
  style?: SectionStyle;
}

export interface ImageTextGridBlockData {
  __component: 'sections.image-text-grid';
  id: number | string;
  eyebrow?: string;
  title: string;
  highlightTitle?: string;
  subtitle?: string;
  imageShape?: 'circle' | 'rounded' | 'square';
  columns?: number;
  items: SharedImageTextItem[];
  style?: SectionStyle;
}

export type DynamicContentBlock =
  | HeroBlockData
  | RichTextBlockData
  | MediaTextBlockData
  | StatsGridBlockData
  | CTABannerBlockData
  | ImageGalleryBlockData
  | FaqSectionBlockData
  | FeaturedProjectsBlockData
  | FeaturedMembersBlockData
  | TeamGridBlockData
  | EmbedBlockData
  | FeatureGridBlockData
  | ImageTextGridBlockData;

export interface PageDetailItem {
  id: string;
  documentId: string;
  title: string;
  slug: string;
  seo?: SEOData;
  contentBlocks: DynamicContentBlock[];
  updatedAt?: string;
}