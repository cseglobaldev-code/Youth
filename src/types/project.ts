import type { GalleryImage } from './common';

export type ProjectStatus = 'ongoing' | 'completed' | 'planned';

export interface Project {
  id: string;
  name: string;
  description: string;
  impactIndication: string;
  region: string;
  countriesCovered: string[];
  focusSdgs: number[];
  status: ProjectStatus;
  outstandingImageUrl: string;
  gallery: GalleryImage[];
  memberId: string;
  donationQrUrl?: string;
  year?: number;
}
