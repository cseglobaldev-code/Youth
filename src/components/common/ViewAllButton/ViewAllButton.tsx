import { PillButton, type PillButtonSize } from '@/components/ui/PillButton';

export interface ViewAllButtonProps {
  /** Đường dẫn nội bộ (react-router) */
  to?: string;
  /** Đường dẫn ngoài (mở tab mới) */
  href?: string;
  /** Handler khi không dùng to/href */
  onClick?: () => void;
  /** Nhãn nút, mặc định "View All" */
  label?: string;
  /** Kích thước nút, mặc định "sm" */
  size?: PillButtonSize;
  className?: string;
}

/**
 * Nút "View All" dùng chung — viền đỏ thương hiệu, hover đổ nền đỏ chữ trắng.
 * Dùng ở các section danh sách (Members, News/Projects, ...).
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
