import type { StatItem } from '@/types';

export function formatStatValue(stat: StatItem): string {
  const prefix = stat.prefix ?? '';
  const suffix = stat.suffix ?? '';
  return `${prefix}${stat.value}${suffix}`;
}

export function parseSdgId(key: string): number | null {
  const match = key.match(/^sdg-?(\d+)$/i);
  if (!match) return null;
  const id = parseInt(match[1], 10);
  return id >= 1 && id <= 17 ? id : null;
}
