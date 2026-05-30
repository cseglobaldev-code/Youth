import { useState } from 'react';
import { Image } from 'antd';
import { cn } from '@/lib/utils';
import type { GalleryImage } from '@/types';

export interface ImageGalleryProps {
  images: GalleryImage[];
  maxVisible?: number;
  columns?: number;
  className?: string;
}

export function computeGalleryLayout(images: GalleryImage[], maxVisible: number) {
  const visibleCount = Math.min(images.length, maxVisible);
  const overflow = images.length > maxVisible ? images.length - maxVisible : 0;
  return { visibleCount, overflow };
}

export function ImageGallery({ images, maxVisible = 6, columns = 3, className }: ImageGalleryProps) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  if (images.length === 0) return null;

  const { visibleCount, overflow } = computeGalleryLayout(images, maxVisible);
  const visibleImages = images.slice(0, visibleCount);

  return (
    <div className={className}>
      <div
        className={cn('grid gap-2')}
        style={{ gridTemplateColumns: `repeat(${Math.min(columns, visibleCount)}, 1fr)` }}
      >
        {visibleImages.map((img, idx) => (
          <div
            key={img.id}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => {
              setPreviewIndex(idx);
              setPreviewVisible(true);
            }}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
            />
            {idx === visibleCount - 1 && overflow > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">+{overflow}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="hidden">
        <Image.PreviewGroup
          preview={{
            visible: previewVisible,
            onVisibleChange: setPreviewVisible,
            current: previewIndex,
            onChange: setPreviewIndex,
          }}
        >
          {images.map((img) => (
            <Image key={img.id} src={img.src} alt={img.alt} />
          ))}
        </Image.PreviewGroup>
      </div>
    </div>
  );
}
