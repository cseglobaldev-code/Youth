import { useState } from 'react';
import { Button, Tooltip, message } from 'antd';
import { Icon } from '@/components/ui/Icon';
import { ICONS } from '@/config/icons';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

export interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  variant?: 'pill' | 'circle' | 'outline' | 'text';
  label?: string;
  className?: string;
}

export function ShareButton({
  title,
  text,
  url,
  variant = 'outline',
  label,
  className,
}: ShareButtonProps) {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const shareTitle = title || (typeof document !== 'undefined' ? document.title : 'Y.O.U');
    const shareText = text || '';

    // 1. Try Native Web Share API first
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err: any) {
        // If the user cancelled/aborted the share sheet, do not fallback to copy
        if (err?.name === 'AbortError') return;
      }
    }

    // 2. Fallback: Copy to Clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        message.success(
          language === 'vi' ? 'Đã sao chép liên kết vào bộ nhớ tạm!' : 'Link copied to clipboard!'
        );
        setTimeout(() => setCopied(false), 2000);
      } catch {
        message.error(
          language === 'vi' ? 'Không thể sao chép liên kết' : 'Failed to copy link'
        );
      }
    }
  };

  const defaultLabel = label || (language === 'vi' ? 'Chia sẻ' : 'Share');
  const copiedLabel = language === 'vi' ? 'Đã sao chép!' : 'Copied!';

  if (variant === 'circle') {
    return (
      <Tooltip title={copied ? copiedLabel : defaultLabel}>
        <Button
          type="default"
          shape="circle"
          onClick={handleShare}
          className={cn(
            '!flex !items-center !justify-center transition-all hover:scale-105 active:scale-95 border-neutral-300 hover:!border-[#005D9A] hover:!text-[#005D9A]',
            className
          )}
          aria-label={defaultLabel}
        >
          <Icon name={copied ? 'lucide:check' : ICONS.share} size={16} />
        </Button>
      </Tooltip>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={handleShare}
        className={cn(
          'inline-flex items-center gap-2 rounded-full bg-[#005D9A] text-white px-5 py-2 text-sm font-semibold transition-all hover:opacity-90 active:scale-95 shadow-sm cursor-pointer',
          className
        )}
        style={{ fontFamily: 'Open Sans, sans-serif' }}
      >
        <Icon name={copied ? 'lucide:check' : ICONS.share} size={16} />
        <span>{copied ? copiedLabel : defaultLabel}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-neutral-300 hover:border-[#005D9A] hover:text-[#005D9A] text-neutral-700 px-4 py-1.5 text-sm font-medium transition-all hover:bg-neutral-50 active:scale-95 cursor-pointer',
        className
      )}
      style={{ fontFamily: 'Open Sans, sans-serif' }}
    >
      <Icon name={copied ? 'lucide:check' : ICONS.share} size={15} />
      <span>{copied ? copiedLabel : defaultLabel}</span>
    </button>
  );
}