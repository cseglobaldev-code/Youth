import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollIntentState {
  scrollTo?: string;
}

/**
 * On route change, scroll to the top — unless the navigation carries a
 * `scrollTo` intent (router state) or a URL hash, in which case scroll to that
 * element instead. The element is re-targeted after a short delay because
 * image-heavy sections (e.g. the homepage) shift layout as media loads.
 */
export function useScrollToTop() {
  const { pathname, hash, state } = useLocation();

  useEffect(() => {
    const targetId =
      (state as ScrollIntentState | null)?.scrollTo ??
      (hash ? hash.slice(1) : undefined);

    if (!targetId) {
      window.scrollTo(0, 0);
      return;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;

    const raf = requestAnimationFrame(() => {
      const el = document.getElementById(targetId);
      if (!el) {
        window.scrollTo(0, 0);
        return;
      }
      el.scrollIntoView({ behavior: 'smooth' });
      // Re-correct once late-loading images settle the layout.
      timer = setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }, 350);
    });

    return () => {
      cancelAnimationFrame(raf);
      if (timer) clearTimeout(timer);
    };
  }, [pathname, hash, state]);
}
