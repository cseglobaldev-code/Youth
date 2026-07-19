import type { GalleryImage } from '@/types';

export function computeGalleryLayout(images: GalleryImage[], maxVisible: number) {
  const visibleCount = Math.min(images.length, maxVisible);
  const overflow = images.length > maxVisible ? images.length - maxVisible : 0;
  return { visibleCount, overflow };
}
