import { BlocksRenderer } from '../BlocksRenderer';
import type { RichTextBlockData } from '@/types';

export function RichTextBlock({ data }: { data: RichTextBlockData }) {
  return (
    <div className="max-w-4xl mx-auto">
      {data.title && (
        <h2 className="mb-6 font-semibold text-2xl md:text-3xl text-neutral-900" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          {data.title}
        </h2>
      )}
      <BlocksRenderer content={data.content} />
    </div>
  );
}