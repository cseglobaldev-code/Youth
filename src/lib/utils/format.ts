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

/** Nhãn nhiệm kỳ bắt cầu hai năm, tự tiến theo lịch. */
export function currentTermLabel(now: Date = new Date()): string {
  const year = now.getFullYear();
  return `${year} - ${year + 1}`;
}

if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;

  describe('currentTermLabel', () => {
    it('bridges the given year into the next', () => {
      expect(currentTermLabel(new Date('2026-07-30'))).toBe('2026 - 2027');
      expect(currentTermLabel(new Date('2026-12-31'))).toBe('2026 - 2027');
      expect(currentTermLabel(new Date('2027-01-01'))).toBe('2027 - 2028');
    });
  });
}
