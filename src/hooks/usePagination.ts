import { useState, useMemo, useCallback } from 'react';
import { paginate } from '@/lib/utils';

export function usePagination<T>(items: T[], pageSize = 9) {
  const [currentPage, setCurrentPage] = useState(1);

  const { pageItems, total } = useMemo(
    () => paginate(items, currentPage, pageSize),
    [items, currentPage, pageSize]
  );

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    pageItems,
    total,
    currentPage,
    pageSize,
    goToPage,
    resetPage,
  };
}
