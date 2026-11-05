export type DocCategory =
  'governance' | 'membership' | 'annual-reports' | 'legal';
export type FileType = 'pdf' | 'xls' | 'doc' | 'ppt';

export interface DocumentItem {
  id: string;
  title: string;
  category: DocCategory;
  fileType: FileType;
  fileUrl: string;
  fileSize?: string;
  updatedAt?: string;
  audience?: 'organizations' | 'individuals';
  revision?: string;
  slug?: string;
  section?: string;
  continent?: 'Africa' | 'America' | 'Asia' | 'Australia' | 'Europe';
  effectiveDate?: string;
  displayMode?: 'archive' | 'slides' | 'annual-report' | 'legal';
  externalUrl?: string;
  embedUrl?: string;
  content?: unknown[];
  coverImageUrl?: string;
  slideImages?: { url: string; alt?: string }[];
  archives?: ArchiveVersion[];
  displayOrder?: number;
}

export interface ArchiveVersion {
  id?: number;
  label?: string;
  revision: string;
  effectiveDate: string;
  url: string;
  embedUrl?: string;
}
