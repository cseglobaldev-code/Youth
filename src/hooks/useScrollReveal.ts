import { useCallback, useRef, useState } from 'react';

/**
 * Triggers `visible=true` once the element scrolls into view.
 * Disconnects after first trigger — one-shot reveal.
 *
 * Uses a callback ref so the observer attaches whenever the node mounts —
 * including elements rendered after an async load (post-skeleton), which a
 * mount-only effect would miss.
 */
export function useScrollReveal(threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (node: HTMLElement | null) => {
      observerRef.current?.disconnect();
      if (!node) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        },
        { threshold }
      );
      obs.observe(node);
      observerRef.current = obs;
    },
    [threshold]
  );

  return { ref, visible } as const;
}
