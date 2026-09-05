import type {
  PageDetailItem,
  DynamicContentBlock,
  HeroBlockData,
  RichTextBlockData,
  MediaTextBlockData,
  StatsGridBlockData,
  CTABannerBlockData,
  ImageGalleryBlockData,
  FaqSectionBlockData,
  FeaturedProjectsBlockData,
  FeaturedMembersBlockData,
  TeamGridBlockData,
  EmbedBlockData,
  FeatureGridBlockData,
  ImageTextGridBlockData,
  SEOData,
} from '@/types';
import {
  cacheGet,
  cacheSet,
  mediaUrl,
  resolveConfig,
  text,
  mapProject,
  mapSocialLinks,
  parseSdgIds,
  type StrapiMedia,
  type StrapiProject,
  type StrapiRequestOptions,
} from './strapi';

interface StrapiRawPage {
  id?: unknown;
  documentId?: unknown;
  title?: unknown;
  slug?: unknown;
  seo?: {
    metaTitle?: unknown;
    metaDescription?: unknown;
    metaImage?: StrapiMedia | null;
    keywords?: unknown;
    preventIndexing?: unknown;
  } | null;
  contentBlocks?: Array<{
    id?: unknown;
    __component?: unknown;
    [key: string]: any;
  }> | null;
  updatedAt?: unknown;
}

interface StrapiPagesResponse {
  data?: StrapiRawPage[];
}

function mapSEO(rawSeo: StrapiRawPage['seo'], baseUrl: string): SEOData | undefined {
  if (!rawSeo) return undefined;
  return {
    metaTitle: text(rawSeo.metaTitle) || undefined,
    metaDescription: text(rawSeo.metaDescription) || undefined,
    metaImage: rawSeo.metaImage ? { url: mediaUrl(rawSeo.metaImage, baseUrl) } : null,
    keywords: text(rawSeo.keywords) || undefined,
    preventIndexing: Boolean(rawSeo.preventIndexing),
  };
}

function mapContentBlock(raw: Record<string, any>, baseUrl: string, index: number): DynamicContentBlock | null {
  const component = text(raw.__component);
  const id = raw.id ?? `${component || 'block'}-${index}`;
  const style = raw.style ? {
    background: raw.style.background,
    paddingTop: raw.style.paddingTop,
    paddingBottom: raw.style.paddingBottom,
    containerWidth: raw.style.containerWidth,
    textAlign: raw.style.textAlign,
  } : undefined;

  switch (component) {
    case 'sections.hero':
      return {
        __component: 'sections.hero',
        id,
        eyebrow: text(raw.eyebrow) || undefined,
        title: text(raw.title),
        highlightTitle: text(raw.highlightTitle) || undefined,
        description: text(raw.description) || undefined,
        layoutVariant: raw.layoutVariant || 'centered',
        image: raw.image,
        imageUrl: mediaUrl(raw.image, baseUrl) || undefined,
        youtubeVideoId: text(raw.youtubeVideoId) || undefined,
        buttons: Array.isArray(raw.buttons) ? raw.buttons : [],
        style,
      } as HeroBlockData;

    case 'sections.rich-text':
      return {
        __component: 'sections.rich-text',
        id,
        title: text(raw.title) || undefined,
        content: Array.isArray(raw.content) ? raw.content : [],
        style,
      } as RichTextBlockData;

    case 'sections.media-text':
      return {
        __component: 'sections.media-text',
        id,
        eyebrow: text(raw.eyebrow) || undefined,
        title: text(raw.title),
        content: text(raw.content),
        media: raw.media,
        mediaUrl: mediaUrl(raw.media, baseUrl) || undefined,
        mediaPosition: raw.mediaPosition || 'right',
        button: raw.button,
        style,
      } as MediaTextBlockData;

    case 'sections.stats-grid':
      return {
        __component: 'sections.stats-grid',
        id,
        title: text(raw.title) || undefined,
        variant: raw.variant || 'home',
        animated: raw.animated ?? true,
        items: Array.isArray(raw.items) ? raw.items : [],
        style,
      } as StatsGridBlockData;

    case 'sections.cta-banner':
      return {
        __component: 'sections.cta-banner',
        id,
        title: text(raw.title),
        description: text(raw.description) || undefined,
        ctaLabel: text(raw.ctaLabel),
        ctaUrl: text(raw.ctaUrl) || undefined,
        theme: raw.theme || 'rainbow-gradient',
        hideStar: Boolean(raw.hideStar),
        style,
      } as CTABannerBlockData;

    case 'sections.image-gallery':
      return {
        __component: 'sections.image-gallery',
        id,
        title: text(raw.title) || undefined,
        variant: raw.variant || 'grid',
        images: Array.isArray(raw.images)
          ? raw.images.map((img: StrapiMedia, idx: number) => ({
              id: `gallery-img-${idx}`,
              src: mediaUrl(img, baseUrl),
              alt: text(img.alternativeText) || '',
            }))
          : [],
        columns: typeof raw.columns === 'number' ? raw.columns : 3,
        maxVisible: typeof raw.maxVisible === 'number' ? raw.maxVisible : 7,
        style,
      } as ImageGalleryBlockData;

    case 'sections.faq-section':
      return {
        __component: 'sections.faq-section',
        id,
        title: text(raw.title) || 'Frequently Asked Questions',
        description: text(raw.description) || undefined,
        useGlobalFaqs: Boolean(raw.useGlobalFaqs),
        customFaqs: Array.isArray(raw.customFaqs) ? raw.customFaqs : [],
        showViewAllButton: raw.showViewAllButton ?? true,
        style,
      } as FaqSectionBlockData;

    case 'sections.featured-projects':
      return {
        __component: 'sections.featured-projects',
        id,
        title: text(raw.title) || 'Featured Projects',
        subtitle: text(raw.subtitle) || undefined,
        projects: Array.isArray(raw.projects)
          ? raw.projects.map((p: StrapiProject) => mapProject(p, baseUrl))
          : [],
        limit: typeof raw.limit === 'number' ? raw.limit : 3,
        showViewAll: raw.showViewAll ?? true,
        style,
      } as FeaturedProjectsBlockData;

    case 'sections.featured-members':
      return {
        __component: 'sections.featured-members',
        id,
        title: text(raw.title) || 'Our Member Organizations',
        subtitle: text(raw.subtitle) || undefined,
        members: Array.isArray(raw.members)
          ? raw.members.map((m: any) => ({
              id: text(m.documentId) || String(m.id ?? ''),
              name: text(m.name),
              country: text(m.country),
              period: text(m.period) || undefined,
              leader: text(m.leader) || undefined,
              focusSdgs: parseSdgIds(m.focusSdgs),
              coverUrl: mediaUrl(m.cover, baseUrl) || undefined,
              logoUrl: mediaUrl(m.logo, baseUrl),
            }))
          : [],
        limit: typeof raw.limit === 'number' ? raw.limit : 6,
        showViewAll: raw.showViewAll ?? true,
        style,
      } as FeaturedMembersBlockData;

    case 'sections.team-grid':
      return {
        __component: 'sections.team-grid',
        id,
        title: text(raw.title) || 'Leadership Team',
        termLabel: text(raw.termLabel) || undefined,
        teamMembers: Array.isArray(raw.teamMembers)
          ? raw.teamMembers.map((t: any) => ({
              id: text(t.documentId) || String(t.id ?? ''),
              name: text(t.name),
              role: text(t.role),
              avatarUrl: mediaUrl(t.avatar, baseUrl),
              continent: text(t.continent),
              socialLinks: mapSocialLinks(t.socialLinks),
            }))
          : [],
        leadershipType: raw.leadershipType || 'all',
        style,
      } as TeamGridBlockData;

    case 'sections.embed':
      return {
        __component: 'sections.embed',
        id,
        title: text(raw.title) || undefined,
        embedUrl: text(raw.embedUrl),
        aspectRatio: raw.aspectRatio || '16:9',
        caption: text(raw.caption) || undefined,
        style,
      } as EmbedBlockData;

    case 'sections.feature-grid':
      return {
        __component: 'sections.feature-grid',
        id,
        eyebrow: text(raw.eyebrow) || undefined,
        title: text(raw.title),
        highlightTitle: text(raw.highlightTitle) || undefined,
        subtitle: text(raw.subtitle) || undefined,
        columns: typeof raw.columns === 'number' ? raw.columns : 4,
        items: Array.isArray(raw.items)
          ? raw.items.map((item: any) => ({
              icon: text(item.icon) || 'lucide:badge-check',
              title: text(item.title),
              description: text(item.description),
              active: Boolean(item.active),
            }))
          : [],
        style,
      } as FeatureGridBlockData;

    case 'sections.image-text-grid':
      return {
        __component: 'sections.image-text-grid',
        id,
        eyebrow: text(raw.eyebrow) || undefined,
        title: text(raw.title),
        highlightTitle: text(raw.highlightTitle) || undefined,
        subtitle: text(raw.subtitle) || undefined,
        imageShape: raw.imageShape || 'circle',
        columns: typeof raw.columns === 'number' ? raw.columns : 5,
        items: Array.isArray(raw.items)
          ? raw.items.map((item: any) => ({
              image: item.image,
              imageUrl: mediaUrl(item.image, baseUrl) || (typeof item.image === 'string' ? item.image : ''),
              title: text(item.title),
              description: text(item.description),
            }))
          : [],
        style,
      } as ImageTextGridBlockData;

    default:
      return null;
  }
}

function mapPageDetail(raw: StrapiRawPage, baseUrl: string): PageDetailItem {
  const blocks = Array.isArray(raw.contentBlocks)
    ? raw.contentBlocks
        .map((block, idx) => mapContentBlock(block, baseUrl, idx))
        .filter((block): block is DynamicContentBlock => block !== null)
    : [];

  return {
    id: String(raw.id ?? ''),
    documentId: text(raw.documentId),
    title: text(raw.title) || 'About Us',
    slug: text(raw.slug) || 'about-us',
    seo: mapSEO(raw.seo, baseUrl),
    contentBlocks: blocks,
    updatedAt: text(raw.updatedAt) || undefined,
  };
}

function appendDeepPopulateParams(query: URLSearchParams) {
  query.append('populate[seo][populate]', '*');
  query.append('populate[contentBlocks][populate]', '*');
  query.append('populate[contentBlocks][on][sections.featured-projects][populate][projects][populate]', '*');
  query.append('populate[contentBlocks][on][sections.featured-members][populate][members][populate]', '*');
  query.append('populate[contentBlocks][on][sections.team-grid][populate][teamMembers][populate]', '*');
}

export async function fetchPageBySlugOrId(
  slugOrId: string,
  options: StrapiRequestOptions = {}
): Promise<PageDetailItem | null> {
  const { baseUrl, token } = resolveConfig(options);
  const isPreview =
    options.bypassCache ||
    (typeof window !== 'undefined' && window.location.search.includes('preview=1'));

  // 1. Search by Slug (Collection Type /api/pages)
  const query = new URLSearchParams();
  query.append('filters[slug][$eq]', slugOrId);
  appendDeepPopulateParams(query);
  query.append('pagination[pageSize]', '1');
  if (isPreview) query.append('status', 'draft');

  const slugUrl = `${baseUrl}/api/pages?${query.toString()}`;
  let payload = cacheGet(slugUrl, isPreview) as StrapiPagesResponse | undefined;

  if (payload === undefined) {
    try {
      const response = await fetch(slugUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        signal: options.signal,
      });

      if (response.ok) {
        payload = (await response.json()) as StrapiPagesResponse;
        if (Array.isArray(payload.data) && payload.data.length > 0 && payload.data[0]) {
          cacheSet(slugUrl, payload, isPreview);
          return mapPageDetail(payload.data[0], baseUrl);
        }
      }
    } catch {
      // Fall through to fallback attempts
    }
  } else if (Array.isArray(payload.data) && payload.data.length > 0 && payload.data[0]) {
    return mapPageDetail(payload.data[0], baseUrl);
  }

  // 2. Fallback: Single Type 'about-us' (/api/about-us)
  if (slugOrId === 'about-us') {
    const aboutQuery = new URLSearchParams();
    appendDeepPopulateParams(aboutQuery);
    if (isPreview) aboutQuery.append('status', 'draft');

    const aboutUrl = `${baseUrl}/api/about-us?${aboutQuery.toString()}`;
    let aboutPayload = cacheGet(aboutUrl, isPreview) as { data?: StrapiRawPage } | undefined;

    if (aboutPayload === undefined) {
      try {
        const response = await fetch(aboutUrl, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          signal: options.signal,
        });

        if (response.ok) {
          aboutPayload = (await response.json()) as { data?: StrapiRawPage };
          if (aboutPayload.data && typeof aboutPayload.data === 'object' && !Array.isArray(aboutPayload.data)) {
            cacheSet(aboutUrl, aboutPayload, isPreview);
            return mapPageDetail(aboutPayload.data, baseUrl);
          }
        }
      } catch {
        // Fall through
      }
    } else if (aboutPayload.data && typeof aboutPayload.data === 'object' && !Array.isArray(aboutPayload.data)) {
      return mapPageDetail(aboutPayload.data, baseUrl);
    }
  }

  // 3. Fallback: Search by Document ID (Direct Preview links)
  const docQuery = new URLSearchParams();
  appendDeepPopulateParams(docQuery);
  if (isPreview) docQuery.append('status', 'draft');

  const docUrl = `${baseUrl}/api/pages/${encodeURIComponent(slugOrId)}?${docQuery.toString()}`;
  let docPayload = cacheGet(docUrl, isPreview) as { data?: StrapiRawPage } | undefined;

  if (docPayload === undefined) {
    try {
      const response = await fetch(docUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        signal: options.signal,
      });

      if (response.ok) {
        docPayload = (await response.json()) as { data?: StrapiRawPage };
        if (
          docPayload.data &&
          typeof docPayload.data === 'object' &&
          !Array.isArray(docPayload.data) &&
          (docPayload.data.title || docPayload.data.slug || docPayload.data.documentId)
        ) {
          cacheSet(docUrl, docPayload, isPreview);
          return mapPageDetail(docPayload.data, baseUrl);
        }
      }
    } catch {
      // Return null on failure
    }
  } else if (
    docPayload.data &&
    typeof docPayload.data === 'object' &&
    !Array.isArray(docPayload.data) &&
    (docPayload.data.title || docPayload.data.slug || docPayload.data.documentId)
  ) {
    return mapPageDetail(docPayload.data, baseUrl);
  }

  return null;
}

export async function fetchHomePage(
  options: StrapiRequestOptions = {}
): Promise<PageDetailItem | null> {
  const { baseUrl, token } = resolveConfig(options);
  const isPreview =
    options.bypassCache ||
    (typeof window !== 'undefined' && window.location.search.includes('preview=1'));

  const query = new URLSearchParams();
  appendDeepPopulateParams(query);
  if (options.locale) query.append('locale', options.locale);
  if (isPreview) query.append('status', 'draft');

  const homeUrl = `${baseUrl}/api/home-page?${query.toString()}`;
  let payload = cacheGet(homeUrl, isPreview) as { data?: StrapiRawPage } | undefined;

  if (payload === undefined) {
    try {
      const response = await fetch(homeUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        signal: options.signal,
      });

      if (response.ok) {
        payload = (await response.json()) as { data?: StrapiRawPage };
        if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
          cacheSet(homeUrl, payload, isPreview);
          return mapPageDetail(payload.data, baseUrl);
        }
      }
    } catch {
      // Return null on failure to use static section fallbacks
    }
  } else if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
    return mapPageDetail(payload.data, baseUrl);
  }

  return null;
}