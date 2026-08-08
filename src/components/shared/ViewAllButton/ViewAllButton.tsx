import { PillButton, type PillButtonSize } from '@/components/ui/PillButton';

export interface ViewAllButtonProps {
  /** Internal route path (react-router) */
  to?: string;
  /** External URL (opens in a new tab) */
  href?: string;
  /** Click handler when not using to/href */
  onClick?: () => void;
  /** Button label, defaults to "View All" */
  label?: string;
  /** Button size, defaults to "sm" */
  size?: PillButtonSize;
  className?: string;
}

/**
 * Shared "View All" button — brand red outline, fills red on hover.
 * Used in list sections (Members, News/Projects, ...).
 */
export function ViewAllButton({
  to,
  href,
  onClick,
  label = 'View All',
  size = 'sm',
  className,
}: ViewAllButtonProps) {
  const as = to ? 'router-link' : href ? 'a' : 'button';

  return (
    <PillButton
      variant="outline"
      size={size}
      as={as}
      to={to}
      href={href}
      onClick={onClick}
      className={className}
    >
      {label}
    </PillButton>
  );
}
