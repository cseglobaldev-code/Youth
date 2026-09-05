import type { SEOData } from '@/types';

function setMetaTag(name: string, content?: string | null, isProperty = false) {
  if (!content || typeof content !== 'string') return;
  const attribute = isProperty ? 'property' : 'name';
  let element = document.querySelector(`meta[${attribute}="${name}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

export function updatePageSEO(seo?: SEOData, fallbackTitle?: string) {
  const title =
    (typeof seo?.metaTitle === 'string' && seo.metaTitle) ||
    (fallbackTitle ? `${fallbackTitle} · Y.O.U` : 'Y.O.U – Youth Organization Union');
  document.title = title;

  if (typeof seo?.metaDescription === 'string' && seo.metaDescription) {
    setMetaTag('description', seo.metaDescription);
    setMetaTag('og:description', seo.metaDescription, true);
  }

  if (typeof seo?.keywords === 'string' && seo.keywords) {
    setMetaTag('keywords', seo.keywords);
  }

  const imageUrl = typeof seo?.metaImage?.url === 'string' ? seo.metaImage.url : undefined;
  if (imageUrl) {
    setMetaTag('og:image', imageUrl, true);
  }

  setMetaTag('og:title', title, true);

  if (seo?.preventIndexing) {
    setMetaTag('robots', 'noindex, nofollow');
  } else {
    const robotsTag = document.querySelector('meta[name="robots"]');
    if (robotsTag) robotsTag.remove();
  }
}