import { HeaderDesktop } from './HeaderDesktop';
import { HeaderMobile } from './HeaderMobile';
import type { NavItem } from '@/types';

export interface HeaderProps {
  navItems?: NavItem[];
  className?: string;
}

export function Header({ navItems, className }: HeaderProps) {
  return (
    <>
      <HeaderDesktop navItems={navItems} className={className} />
      <HeaderMobile navItems={navItems} className={className} />
    </>
  );
}
