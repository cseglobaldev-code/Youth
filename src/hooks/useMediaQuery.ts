import { useSyncExternalStore } from 'react';

/**
 * Theo dõi một media query và trả về true khi khớp.
 * Dùng useSyncExternalStore để đăng ký/huỷ đăng ký an toàn,
 * tránh setState trong effect (cascading renders).
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
