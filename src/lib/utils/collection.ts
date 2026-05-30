import { parseSdgId } from './format';

export interface PaginateResult<T> {
  pageItems: T[];
  total: number;
}

export function paginate<T>(items: T[], page: number, pageSize: number): PaginateResult<T> {
  const total = items.length;
  const maxPage = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.max(1, Math.min(page, maxPage));
  const start = (safePage - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);
  return { pageItems, total };
}

export function filterBySdg<T extends { focusSdgs: number[] }>(
  items: T[],
  key: string
): T[] {
  if (key === 'all') return items;
  const sdgId = parseSdgId(key);
  if (sdgId === null) return items;
  return items.filter((item) => item.focusSdgs.includes(sdgId));
}
