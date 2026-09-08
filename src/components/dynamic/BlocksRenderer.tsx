import React from 'react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

interface TextNode {
  type: 'text';
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

interface BlockNode {
  type: string;
  level?: number;
  format?: 'ordered' | 'unordered';
  url?: string;
  image?: { url: string; alternativeText?: string };
  children?: (BlockNode | TextNode)[];
}

interface BlocksRendererProps {
  content?: BlockNode[] | any;
  className?: string;
}

function resolveImageUrl(url?: string): string {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  const baseUrl = (import.meta.env.VITE_STRAPI_API_URL || (typeof window !== 'undefined' ? window.location.origin : '')).replace(/\/$/, '');
  return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
}

function renderTextNode(node: TextNode, key: number) {
  let element: React.ReactNode = node.text;

  if (node.bold) element = <strong>{element}</strong>;
  if (node.italic) element = <em>{element}</em>;
  if (node.underline) element = <u>{element}</u>;
  if (node.strikethrough) element = <s>{element}</s>;
  if (node.code) element = <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-sm text-[#EE334E]">{element}</code>;

  return <React.Fragment key={key}>{element}</React.Fragment>;
}

function renderChildNode(child: BlockNode | TextNode, key: number): React.ReactNode {
  if (child.type === 'text') {
    return renderTextNode(child as TextNode, key);
  }
  return renderBlockNode(child as BlockNode, key);
}

function renderBlockNode(node: BlockNode, key: number): React.ReactNode {
  const children = Array.isArray(node.children)
    ? node.children.map((child, idx) => renderChildNode(child, idx))
    : null;

  switch (node.type) {
    case 'paragraph':
      return (
        <p key={key} className="mb-4 text-base leading-[160%] text-neutral-700 md:text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
          {children}
        </p>
      );

    case 'heading': {
      const level = node.level || 2;
      const Tag = `h${Math.min(Math.max(level, 1), 6)}` as keyof React.JSX.IntrinsicElements;
      const headingStyles: Record<number, string> = {
        1: 'text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 mt-8 leading-tight',
        2: 'text-2xl md:text-3xl lg:text-4xl font-semibold text-neutral-900 mb-5 mt-7 leading-tight',
        3: 'text-xl md:text-2xl font-semibold text-neutral-900 mb-4 mt-6 leading-snug',
        4: 'text-lg md:text-xl font-semibold text-neutral-900 mb-3 mt-5',
        5: 'text-base md:text-lg font-semibold text-neutral-900 mb-2 mt-4',
        6: 'text-sm md:text-base font-semibold text-neutral-900 mb-2 mt-3',
      };
      return (
        <Tag key={key} className={headingStyles[level] || headingStyles[2]} style={{ fontFamily: 'Open Sans, sans-serif' }}>
          {children}
        </Tag>
      );
    }

    case 'list': {
      if (node.format === 'ordered') {
        return <ol key={key} className="my-4 list-decimal space-y-2 pl-6 text-base text-neutral-700 md:text-lg">{children}</ol>;
      }
      return <ul key={key} className="my-4 list-disc space-y-2 pl-6 text-base text-neutral-700 md:text-lg">{children}</ul>;
    }

    case 'list-item':
      return <li key={key}>{children}</li>;

    case 'quote':
      return (
        <blockquote key={key} className="my-6 border-l-4 border-[#005D9A] bg-[#F2F7FF] py-3 pl-5 italic text-neutral-700 rounded-r-xl">
          {children}
        </blockquote>
      );

    case 'code':
      return (
        <pre key={key} className="my-6 overflow-x-auto rounded-2xl bg-[#0B1A2B] p-5 font-mono text-sm text-white">
          <code>{children}</code>
        </pre>
      );

    case 'link':
      return (
        <a
          key={key}
          href={node.url}
          target={node.url?.startsWith('http') ? '_blank' : undefined}
          rel={node.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="font-semibold text-[#005D9A] underline decoration-[#005D9A]/40 underline-offset-4 transition hover:text-[#EE334E] hover:decoration-[#EE334E]"
        >
          {children}
        </a>
      );

    case 'image':
      if (!node.image?.url) return null;
      return (
        <div key={key} className="my-6 overflow-hidden rounded-2xl">
          <ImageWithFallback
            src={resolveImageUrl(node.image.url)}
            alt={node.image.alternativeText || ''}
            className="h-auto max-h-[550px] w-full object-cover"
          />
        </div>
      );

    case 'table':
      return (
        <div key={key} className="my-6 overflow-x-auto rounded-xl border border-neutral-200">
          <table className="w-full text-left border-collapse text-sm md:text-base">
            <tbody>{children}</tbody>
          </table>
        </div>
      );

    case 'table-row':
      return (
        <tr key={key} className="border-b border-neutral-200 last:border-0 hover:bg-neutral-50/50">
          {children}
        </tr>
      );

    case 'table-cell':
      return (
        <td key={key} className="px-4 py-3 text-neutral-700">
          {children}
        </td>
      );

    default:
      return <div key={key}>{children}</div>;
  }
}

export function BlocksRenderer({ content, className }: BlocksRendererProps) {
  if (!Array.isArray(content) || content.length === 0) return null;

  return (
    <div className={className}>
      {content.map((node, index) => renderBlockNode(node, index))}
    </div>
  );
}