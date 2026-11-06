import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';
import { ICONS } from '@/config/icons';
import { documentCaption, safeDocumentUrl } from '@/lib/utils/documentLinks';
import { ROUTES } from '@/routes/paths';
import type { DocumentItem, FileType } from '@/types';

export interface DocumentRowProps {
  document: DocumentItem;
  onDownload?: (doc: DocumentItem) => void;
  className?: string;
}
const badges: Record<FileType, string> = {
  pdf: 'bg-[#FDE7EB] text-[#EE334E]',
  xls: 'bg-[#E4F6EC] text-[#16A34A]',
  doc: 'bg-[#E6F0FB] text-[#1771B9]',
  ppt: 'bg-[#FDEFD9] text-[#E08C0A]',
};

export function DocumentRow({
  document: doc,
  onDownload,
  className,
}: DocumentRowProps) {
  const detail = ROUTES.DOCUMENT_DETAIL(doc.slug || doc.id);
  const file = safeDocumentUrl(doc.fileUrl);
  const actionStyle =
    'flex items-center justify-center w-10 h-10 rounded-full bg-brand-50 text-brand hover:bg-brand hover:text-white';
  return (
    <div
      className={cn(
        'relative flex items-center gap-3 sm:gap-5 py-5 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-[#E42C27]/40 after:via-[#FBAB1A]/40 after:to-[#10984F]/40',
        className,
      )}
    >
      <div
        className={cn(
          'shrink-0 flex items-center justify-center rounded-full w-14 h-14',
          badges[doc.fileType],
        )}
      >
        <Icon name={ICONS[doc.fileType]} size={26} aria-label={doc.fileType} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-neutral-900 text-base sm:text-lg break-words">
          <Link to={detail} className="hover:text-brand">
            {doc.title}
          </Link>
        </h4>
        <p className="text-sm text-neutral-500 mt-1">{documentCaption(doc)}</p>
      </div>
      <div className="flex gap-2 shrink-0">
        {file && (
          <a
            href={file}
            download
            className={actionStyle}
            aria-label={`Download ${doc.title}`}
            onClick={(e) => {
              if (onDownload) {
                e.preventDefault();
                onDownload(doc);
              }
            }}
          >
            <Icon name={ICONS.download} size={18} />
          </a>
        )}
        <Link
          to={detail}
          className={actionStyle}
          aria-label={`Open ${doc.title}`}
        >
          <Icon name={ICONS.arrowUpRight} size={18} />
        </Link>
      </div>
    </div>
  );
}
