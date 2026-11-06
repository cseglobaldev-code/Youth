import { useEffect, useState } from 'react';

// Publish updates are revalidated on reload, focus and every 30 visible seconds.
export function usePublishedDocuments<T>(
  loader: (signal: AbortSignal) => Promise<T>,
  key: string,
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    let controller: AbortController | undefined;
    setData(null);
    setLoading(true);
    setError(false);
    const refresh = async () => {
      if (document.visibilityState === 'hidden') return;
      controller?.abort();
      controller = new AbortController();
      const request = controller;
      try {
        const result = await loader(request.signal);
        if (active && !request.signal.aborted) {
          setData(result);
          setError(false);
        }
      } catch (err) {
        if (
          active &&
          !request.signal.aborted &&
          !(err instanceof DOMException && err.name === 'AbortError')
        )
          setError(true);
      } finally {
        if (active && !request.signal.aborted) setLoading(false);
      }
    };
    void refresh();
    const timer = window.setInterval(() => void refresh(), 30_000);
    const onFocus = () => void refresh();
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      active = false;
      controller?.abort();
      clearInterval(timer);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
    // The key identifies the resource; inline loaders are recreated on render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return { data, loading, error };
}
