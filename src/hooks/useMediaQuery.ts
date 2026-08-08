import { useSyncExternalStore } from 'react';

/**
 * Subscribe to a media query and return true when it matches.
 * Uses useSyncExternalStore for safe subscribe/unsubscribe,
 * avoiding setState inside effects (cascading renders).
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = (onChange: () => void) => {
    if (typeof window === 'undefined') return () => {};
    const mql = window.matchMedia(query);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  };

  const getSnapshot = () =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false;

  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
