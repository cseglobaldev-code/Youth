import type { EmbedBlockData } from '@/types';

const ASPECT_MAP: Record<string, string> = {
  '16:9': 'aspect-[16/9]',
  '4:3': 'aspect-[4/3]',
  '1:1': 'aspect-square',
  auto: 'h-[450px]',
};

function formatEmbedUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  return trimmed;
}

export function EmbedBlock({ data }: { data: EmbedBlockData }) {
  const aspectClass = ASPECT_MAP[data.aspectRatio || '16:9'] || ASPECT_MAP['16:9'];
  const safeEmbedUrl = formatEmbedUrl(data.embedUrl);

  return (
    <div className="max-w-5xl mx-auto">
      {data.title && (
        <h2 className="mb-4 font-semibold text-2xl md:text-3xl text-neutral-900 text-center" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          {data.title}
        </h2>
      )}
      <div className={`w-full overflow-hidden rounded-3xl shadow-md bg-neutral-100 ${aspectClass}`}>
        <iframe
          src={safeEmbedUrl}
          title={data.title || 'Embed content'}
          className="h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
      {data.caption && <p className="mt-3 text-center text-sm text-neutral-500 italic">{data.caption}</p>}
    </div>
  );
}