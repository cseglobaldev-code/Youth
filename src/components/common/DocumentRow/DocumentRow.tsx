import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';
import { ICONS } from '@/config/icons';
import type { DocumentItem, FileType } from '@/types';

export interface DocumentRowProps {
  document: DocumentItem;
  onDownload?: (doc: DocumentItem) => void;
  className?: string;
}

const fileTypeIcons: Record<FileType, string> = {
  pdf: ICONS.pdf,
  xls: ICONS.xls,
  doc: ICONS.doc,
  ppt: ICONS.ppt,
};

/** Soft tinted badge per file type, mirroring the Policy & Documents design. */
const fileTypeBadge: Record<FileType, string> = {
  pdf: 'bg-[#FDE7EB] text-[#EE334E]',
  xls: 'bg-[#E4F6EC] text-[#16A34A]',
  doc: 'bg-[#E6F0FB] text-[#1771B9]',
  ppt: 'bg-[#FDEFD9] text-[#E08C0A]',
};

function formatDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

export function DocumentRow({ document, onDownload, className }: DocumentRowProps) {
  const meta = [document.fileType.toUpperCase(), document.fileSize, formatDate(document.updatedAt)]
    .filter(Boolean)
    .join('  ·  ');

  return (
    <div
      className={cn(
        'group flex items-center gap-4 sm:gap-5 py-5 transition-colors',
        className
      )}
    >
      {/* File-type badge */}
      <div
        className={cn(
          'shrink-0 flex items-center justify-center rounded-full w-14 h-14',
          fileTypeBadge[document.fileType]
        )}
      >
        <Icon
          name={fileTypeIcons[document.fileType]}
          size={26}
          aria-label={document.fileType}
        />
      </div>

      {/* Title + meta */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-neutral-900 text-base sm:text-lg truncate">
          {document.title}
        </h4>
        {meta && <p className="text-sm text-neutral-500 mt-1">{meta}</p>}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <a
          href={document.fileUrl}
          download
          className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-50 text-brand transition-all hover:bg-brand hover:text-white hover:scale-105 active:scale-95"
          onClick={(e) => {
            if (onDownload) {
              e.preventDefault();
              onDownload(document);
            }
          }}
          aria-label={`Download ${document.title}`}
        >
          <Icon name={ICONS.download} size={18} />
        </a>
        <a
          href={document.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-50 text-brand transition-all hover:bg-brand hover:text-white hover:scale-105 active:scale-95"
          aria-label={`Open ${document.title}`}
        >
          <Icon name={ICONS.arrowUpRight} size={18} />
        </a>
      </div>
    </div>
  );
}
