import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/layout/Logo';
import { Icon } from '@/components/ui/Icon';
import { NAV_ITEMS } from '@/data';
import type { NavItem } from '@/types';

interface HeaderDesktopProps {
  navItems?: NavItem[];
  className?: string;
}

export function HeaderDesktop({ navItems, className }: HeaderDesktopProps) {
  const items = navItems ?? NAV_ITEMS;
  const { pathname } = useLocation();

  return (
    <header
      className={cn(
        'hidden lg:block sticky top-0 z-50 bg-white border-b border-neutral-200',
        className
      )}
    >
      <div className="px-4 md:px-8 lg:px-[90px]">
        <div className="flex items-center justify-between h-[84px]">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-10">
            <Logo />
            <nav className="flex items-center h-full gap-7">
              {items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-brand relative h-[84px] inline-flex items-center',
                    pathname === item.path
                      ? 'text-brand after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[3px] after:bg-brand after:rounded-t'
                      : 'text-neutral-700'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: CTA + Language */}
          <div className="flex items-center gap-4">
            <Link
              to="/members"
              className="px-5 py-2.5 bg-[#EE334E] text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
            >
              Join 1500+ Youth Organizations
            </Link>
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-neutral-700 hover:text-brand transition-colors">
              <Icon name="lucide:globe" size={16} />
              English
              <Icon name="lucide:chevron-down" size={14} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
