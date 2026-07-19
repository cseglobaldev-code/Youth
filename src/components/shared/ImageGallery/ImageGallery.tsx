import { useState } from 'react';
import { Image } from 'antd';
import { cn } from '@/lib/utils';
import type { GalleryImage } from '@/types';
import { computeGalleryLayout } from './computeGalleryLayout';

export interface ImageGalleryProps {
  images: GalleryImage[];
  maxVisible?: number;
  columns?: number;
  variant?: 'grid' | 'featured';
  className?: string;
}

export function ImageGallery({ images, maxVisible = 6, columns = 3, variant = 'grid', className }: ImageGalleryProps) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  if (images.length === 0) return null;

  const { visibleCount, overflow } = computeGalleryLayout(images, maxVisible);
  const visibleImages = images.slice(0, visibleCount);

  const openPreview = (index: number) => {
    setPreviewIndex(index);
    setPreviewVisible(true);
  };

  const renderPreviewGroup = () => (
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
  );

  if (variant === 'featured') {
    const [featuredImage, ...sideImages] = visibleImages;

    return (
      <div className={className}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.08fr_1.92fr]">
          {featuredImage && (
            <button
              type="button"
              className="group relative min-h-[320px] overflow-hidden rounded-[16px] bg-neutral-100 text-left lg:min-h-[612px]"
              onClick={() => openPreview(0)}
            >
              <img
                src={featuredImage.src}
                alt={featuredImage.alt}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </button>
          )}

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {sideImages.map((img, sideIndex) => {
              const imageIndex = sideIndex + 1;
              const isLastVisible = imageIndex === visibleCount - 1;

              return (
                <button
                  key={img.id}
                  type="button"
                  className="group relative min-h-[148px] overflow-hidden rounded-[16px] bg-neutral-100 text-left lg:min-h-[298px]"
                  onClick={() => openPreview(imageIndex)}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {isLastVisible && overflow > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/55">
                      <span className="text-[24px] font-semibold text-white">+{overflow}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {renderPreviewGroup()}
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        className={cn('grid gap-2')}
        style={{ gridTemplateColumns: `repeat(${Math.min(columns, visibleCount)}, 1fr)` }}
      >
        {visibleImages.map((img, idx) => (
          <div
            key={img.id}
            className="relative aspect-square cursor-pointer overflow-hidden rounded-lg group"
            onClick={() => openPreview(idx)}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
            {idx === visibleCount - 1 && overflow > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="text-2xl font-bold text-white">+{overflow}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {renderPreviewGroup()}
    </div>
  );
}
