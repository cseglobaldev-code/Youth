// src/lib/strapi.ts
import type { 
  Member, 
  Project, 
  TeamMember, 
  Continent, 
  RegionGroup, 
  DocumentItem, 
  DocCategory, 
  FileType,
  FAQ,
  NewsItem,
  StatItem
} from '@/types';

const API_URL = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';
const API_TOKEN = import.meta.env.VITE_STRAPI_API_TOKEN;

function getMediaUrl(mediaObj: any): string {
  if (!mediaObj || !mediaObj.data) return '';
  const attributes = mediaObj.data.attributes || mediaObj.data;
  const url = attributes?.url;
  if (!url) return '';
  return url.startsWith('/') ? `${API_URL}${url}` : url;
}

function mapGallery(galleryData: any): any[] {
  if (!galleryData || !galleryData.data) return [];
  return galleryData.data.map((item: any) => {
    const attrs = item.attributes || item;
    return {
      id: String(item.id),
      src: attrs.url ? (attrs.url.startsWith('/') ? `${API_URL}${attrs.url}` : attrs.url) : '',
      alt: attrs.alternativeText || 'Gallery Image',
    };
  });
}

async function fetchAPI<T>(path: string): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (API_TOKEN) {
    headers['Authorization'] = `Bearer ${API_TOKEN}`;
  }
  const response = await fetch(`${API_URL}/api/${path}`, { headers });
  if (!response.ok) {
    throw new Error(`Strapi API Error [${response.status}]: ${path}`);
  }
  return response.json() as Promise<T>;
}

/* ════════════════ MAPPERS ════════════════ */

export function mapStrapiMember(data: any): Member {
  const attrs = data.attributes || data;
  return {
    id: String(data.id),
    name: attrs.name || '',
    logoUrl: getMediaUrl(attrs.logo) || '/images/placeholder-logo.png',
    coverUrl: getMediaUrl(attrs.cover) || undefined,
    shortDescription: attrs.shortDescription || '',
    description: attrs.description || '',
    country: attrs.country || '',
    continent: (attrs.continent as Continent) || 'Asia',
    focusSdgs: Array.isArray(attrs.focusSdgs) ? attrs.focusSdgs.map(Number) : [],
    socialLinks: attrs.socialLinks || [],
    projectIds: attrs.projects?.data ? attrs.projects.data.map((p: any) => String(p.id)) : [],
    gallery: mapGallery(attrs.gallery),
    donationQrUrl: getMediaUrl(attrs.donationQr) || undefined,
    period: attrs.period || '',
    leader: attrs.leader || '',
  };
}

export function mapStrapiProject(data: any): Project {
  const attrs = data.attributes || data;
  return {
    id: String(data.id),
    name: attrs.name || '',
    description: attrs.description || '',
    impactIndication: attrs.impactIndication || '',
    region: attrs.region || '',
    countriesCovered: attrs.countriesCovered || [],
    focusSdgs: Array.isArray(attrs.focusSdgs) ? attrs.focusSdgs.map(Number) : [],
    status: attrs.projectStatus || 'ongoing', 
    outstandingImageUrl: getMediaUrl(attrs.outstandingImage) || '/images/placeholder-cover.png',
    gallery: mapGallery(attrs.gallery),
    memberId: attrs.member?.data ? String(attrs.member.data.id) : '',
    year: attrs.year ? Number(attrs.year) : undefined,
  };
}

export function mapStrapiTeamMember(data: any): TeamMember {
  const attrs = data.attributes || data;
  return {
    id: String(data.id),
    name: attrs.name || '',
    role: attrs.role || '',
    avatarUrl: getMediaUrl(attrs.avatar) || '/images/placeholder-avatar.png',
    continent: (attrs.continent as Continent) || 'Asia',
    regionGroup: attrs.regionGroup as RegionGroup | undefined,
    socialLinks: attrs.socialLinks || [],
    bio: Array.isArray(attrs.bio) ? attrs.bio : attrs.bio ? [attrs.bio] : [],
    sdgTags: attrs.sdgTags || [],
    year: attrs.year || '',
  };
}

export function mapStrapiDocument(data: any): DocumentItem {
  const attrs = data.attributes || data;
  return {
    id: String(data.id),
    title: attrs.title || '',
    category: (attrs.category as DocCategory) || 'governance',
    fileType: (attrs.fileType as FileType) || 'pdf',
    fileUrl: attrs.file?.data ? getMediaUrl(attrs.file) : '',
    fileSize: attrs.fileSize || undefined,
    updatedAt: attrs.updatedAt ? attrs.updatedAt.split('T')[0] : undefined,
  };
}

export function mapStrapiNewsItem(data: any): NewsItem {
  const attrs = data.attributes || data;
  return {
    id: String(data.id),
    title: attrs.title || '',
    excerpt: attrs.excerpt || '',
    imageUrl: getMediaUrl(attrs.image) || '/images/placeholder-news.png',
    date: attrs.date || '',
    category: attrs.category || undefined,
  };
}

export function mapStrapiStatItem(data: any): StatItem {
  const attrs = data.attributes || data;
  return {
    id: String(data.id),
    label: attrs.label || '',
    value: attrs.value ? Number(attrs.value) : 0,
    prefix: attrs.prefix || undefined,
    suffix: attrs.suffix || undefined,
  };
}

/* ════════════════ API ACTIONS ════════════════ */

export const StrapiService = {
  async getMembers(): Promise<Member[]> {
    const res = await fetchAPI<any>('members?populate=*');
    return (res.data || []).map(mapStrapiMember);
  },
  async getMemberById(id: string): Promise<Member> {
    const res = await fetchAPI<any>(`members/${id}?populate=*`);
    return mapStrapiMember(res.data);
  },
  async getProjects(): Promise<Project[]> {
    const res = await fetchAPI<any>('projects?populate=*');
    return (res.data || []).map(mapStrapiProject);
  },
  async getProjectById(id: string): Promise<Project> {
    const res = await fetchAPI<any>(`projects/${id}?populate=*`);
    return mapStrapiProject(res.data);
  },
  async getTeamMembers(): Promise<TeamMember[]> {
    const res = await fetchAPI<any>('team-members?populate=*');
    return (res.data || []).map(mapStrapiTeamMember);
  },
  async getDocuments(): Promise<DocumentItem[]> {
    const res = await fetchAPI<any>('policy-documents?populate=*'); 
    return (res.data || []).map(mapStrapiDocument);
  },
  async getFAQs(): Promise<FAQ[]> {
    const res = await fetchAPI<any>('faqs');
    return (res.data || []).map((item: any) => ({
      id: String(item.id),
      question: item.attributes?.question || item.question || '',
      answer: item.attributes?.answer || item.answer || '',
    }));
  },
  async getNewsItems(): Promise<NewsItem[]> {
    const res = await fetchAPI<any>('news-items?populate=*');
    return (res.data || []).map(mapStrapiNewsItem);
  },
  async getStatItems(): Promise<StatItem[]> {
    const res = await fetchAPI<any>('stat-items');
    return (res.data || []).map(mapStrapiStatItem);
  },
  async getGlobalSetting(): Promise<any> {
    const res = await fetchAPI<any>('global-setting?populate=*');
    return res.data?.attributes || res.data || null;
  }
};