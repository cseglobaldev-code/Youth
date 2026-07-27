import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

export interface ImageWithFallbackProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string;
  /** Icon shown when the image is missing or fails to load. */
  fallbackIcon?: string;
}

/**
 * <img> that shows a neutral placeholder when `src` is empty or the image
 * fails to load — prevents the broken-image glyph and the browser's
 * "empty string passed to src" refetch warning.
 */
export function ImageWithFallback({
  src,
  alt = '',
  className,
  fallbackIcon = 'lucide:image',
  ...rest
}: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;

  if (showFallback) {
    return (
      <div
        role="img"
        aria-label={alt || undefined}
        className={cn('flex items-center justify-center bg-[#EAF3FA] text-[#9BB8CE]', className)}
      >
        <Icon name={fallbackIcon} size={40} aria-hidden />
      </div>
    );
  }

  return (
    <img src={src} alt={alt} className={className} onError={() => setFailed(true)} {...rest} />
  );
}
