import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';
import { ICONS } from '@/config/icons';
import type { DocumentItem } from '@/types';

export interface DocumentRowProps {
  document: DocumentItem;
  onDownload?: (doc: DocumentItem) => void;
  className?: string;
}

const fileTypeIcons: Record<string, string> = {
  pdf: ICONS.pdf,
  xls: ICONS.xls,
  doc: ICONS.doc,
  ppt: ICONS.ppt,
};

export function DocumentRow({ document, onDownload, className }: DocumentRowProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors',
        className
      )}
    >
      <Icon
        name={fileTypeIcons[document.fileType] || ICONS.pdf}
        size={32}
        className="text-neutral-500 shrink-0"
        aria-label={document.fileType}
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-neutral-900 text-sm truncate">{document.title}</h4>
        <p className="text-xs text-neutral-500 mt-0.5">
          {document.category} {document.fileSize && `• ${document.fileSize}`}
        </p>
      </div>
      <a
        href={document.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 text-brand hover:text-brand-dark transition-colors"
        onClick={(e) => {
          if (onDownload) {
            e.preventDefault();
            onDownload(document);
          }
        }}
        aria-label={`Download ${document.title}`}
      >
        <Icon name={ICONS.download} size={20} />
      </a>
    </div>
  );
}
