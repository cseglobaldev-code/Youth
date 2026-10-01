export type DocCategory = 'governance' | 'membership' | 'annual-reports';
export type FileType = 'pdf' | 'xls' | 'doc' | 'ppt';

export interface DocumentItem {
  id: string;
  title: string;
  category: DocCategory;
  fileType: FileType;
  fileUrl: string;
  fileSize?: string;
  updatedAt?: string;
}
