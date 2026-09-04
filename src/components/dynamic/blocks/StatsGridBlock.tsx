import { StatsGrid } from '@/components/shared/StatsGrid';
import type { StatsGridBlockData } from '@/types';

export function StatsGridBlock({ data }: { data: StatsGridBlockData }) {
  return (
    <div>
      {data.title && (
        <h2 className="mb-8 text-center font-semibold text-2xl md:text-3xl text-neutral-900" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          {data.title}
        </h2>
      )}
      <StatsGrid stats={data.items} variant={data.variant || 'home'} animated={data.animated} />
    </div>
  );
}