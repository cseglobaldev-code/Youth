import { ImageGallery } from '@/components/shared/ImageGallery';
import type { ImageGalleryBlockData } from '@/types';

export function ImageGalleryBlock({ data }: { data: ImageGalleryBlockData }) {
  return (
    <div>
      {data.title && (
        <h2 className="mb-6 font-semibold text-2xl md:text-3xl text-neutral-900" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          {data.title}
        </h2>
      )}
      <ImageGallery
        images={data.images}
        variant={data.variant || 'grid'}
        columns={data.columns || 3}
        maxVisible={data.maxVisible || 7}
      />
    </div>
  );
}