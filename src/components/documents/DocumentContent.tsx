import { BlocksRenderer } from '@/components/dynamic/BlocksRenderer';
import { safeDocumentUrl } from '@/lib/utils/documentLinks';

// Keep the Strapi block editor format; render React nodes rather than raw HTML.
function clean(node: any): any {
  if (!node || typeof node !== 'object') return node;
  const result = { ...node };
  if (node.type === 'link')
    result.url =
      safeDocumentUrl(node.url) ||
      (/^(?:mailto:|tel:|#[\w-])/i.test(node.url || '') ? node.url : '#');
  if (node.type === 'image' && node.image)
    result.image = { ...node.image, url: safeDocumentUrl(node.image.url) };
  if (Array.isArray(node.children)) result.children = node.children.map(clean);
  return result;
}
export function DocumentContent({ blocks }: { blocks: unknown[] }) {
  return (
    <div className="break-words [overflow-wrap:anywhere] [&_h2]:mt-8 [&_h3]:mt-6 [&_p]:leading-8 [&_p]:mb-4">
      <BlocksRenderer content={blocks.map(clean)} />
    </div>
  );
}
