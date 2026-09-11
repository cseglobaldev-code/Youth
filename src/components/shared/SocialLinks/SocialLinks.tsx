import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';
import { ICONS } from '@/config/icons';
import type { SocialLink } from '@/types';

export interface SocialLinksProps {
  links: SocialLink[];
  size?: number;
  className?: string;
}

const ALLOWED_SOCIAL_PLATFORMS = new Set(['facebook', 'instagram', 'linkedin', 'youtube']);

export function SocialLinks({ links, size = 20, className }: SocialLinksProps) {
  const allowedLinks = links.filter((link) => ALLOWED_SOCIAL_PLATFORMS.has(link.platform));
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {allowedLinks.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-500 hover:text-brand transition-colors"
          aria-label={link.platform}
        >
          <Icon name={ICONS[link.platform]} size={size} />
        </a>
      ))}
    </div>
  );
}
