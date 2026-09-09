import { useCallback, useSyncExternalStore } from 'react';

const getServerSnapshot = () => false;

/**
 * Subscribe to a media query and return true when it matches.
 * Uses useSyncExternalStore with memoized subscribe/getSnapshot callbacks
 * for stable subscription and avoiding redundant re-subscribes.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window === 'undefined') return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query]
  );

  const getSnapshot = useCallback(
    () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false),
    [query]
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
