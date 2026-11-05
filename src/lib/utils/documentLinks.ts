export function safeDocumentUrl(raw?: string): string {
  if (!raw) return '';
  const value = raw.trim();
  if (/^\/(?!\/)/.test(value) && !/[\\\u0000-\u001f]/.test(value)) return value;
  try {
    const url = new URL(value);
    const localHttp =
      url.protocol === 'http:' &&
      ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    return (url.protocol === 'https:' || localHttp) &&
      !url.username &&
      !url.password
      ? url.href
      : '';
  } catch {
    return '';
  }
}

// Public share links and iframe URLs are not interchangeable. Unknown providers
// remain normal links rather than broken or unrestricted frames.
export function documentEmbedUrl(raw?: string): string {
  const safe = safeDocumentUrl(raw);
  if (!safe) return '';
  if (safe.startsWith('/')) return /\.pdf(?:$|[?#])/i.test(safe) ? safe : '';
  const url = new URL(safe);
  if (url.hostname === 'drive.google.com') {
    const id = url.pathname.match(/^\/file\/d\/([\w-]+)/)?.[1];
    return id ? `https://drive.google.com/file/d/${id}/preview` : '';
  }
  if (url.hostname === 'docs.google.com') {
    if (/^\/presentation\/d\/(?:e\/)?[\w-]+/.test(url.pathname)) {
      url.pathname = url.pathname.replace(
        /\/(?:edit|pub|preview|present|embed)\/?$/,
        '/embed',
      );
      if (!url.pathname.endsWith('/embed')) url.pathname += '/embed';
      url.search = '?start=false&loop=false';
      url.hash = '';
      return url.href;
    }
    if (/^\/(document|spreadsheets)\/d\/(?:e\/)?[\w-]+/.test(url.pathname)) {
      url.pathname = url.pathname.replace(/\/(?:edit|preview)\/?$/, '/preview');
      if (!/\/(?:pub|pubhtml|preview)$/.test(url.pathname))
        url.pathname += '/preview';
      // Published Docs use /pub, not /preview.
      if (url.pathname.endsWith('/pub'))
        url.searchParams.set('embedded', 'true');
      url.hash = '';
      return url.href;
    }
  }
  if (url.hostname === 'onedrive.live.com' && url.pathname === '/embed')
    return url.href;
  if (
    url.hostname === 'www.canva.com' &&
    /\/view$/.test(url.pathname) &&
    url.searchParams.has('embed')
  )
    return url.href;
  return /\.pdf(?:$|[?#])/i.test(url.href) ? url.href : '';
}

export function formatDocumentDate(raw?: string): string {
  if (!raw) return '';
  const date = new Date(raw);
  return Number.isNaN(date.getTime())
    ? ''
    : new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(date);
}

export function documentVersion(raw?: string): string {
  const value = (raw || '0.0').replace(/^v/i, '');
  return `v${/^\d+$/.test(value) ? `${Number(value)}.0` : value}`;
}

export function documentCaption(doc: {
  revision?: string;
  effectiveDate?: string;
  updatedAt?: string;
}): string {
  return [
    documentVersion(doc.revision),
    formatDocumentDate(doc.effectiveDate || doc.updatedAt),
  ]
    .filter(Boolean)
    .join(' - ');
}
