import { Link, useLocation } from 'react-router-dom';
import { Button } from 'antd';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/layout/Logo';
import { Icon } from '@/components/ui/Icon';
import { NAV_ITEMS } from '@/data';
import type { NavItem } from '@/types';

function scrollToJoinSection() {
  const el = document.getElementById('join-section');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.location.href = '/#join-section';
  }
}

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
          {/* Left group: Logo + Nav (nav spans ~half the screen) */}
          <div className="flex items-center gap-10 flex-1">
            <Logo />
            <nav className="flex items-center gap-8 lg:gap-[48px] h-full w-[50vw] max-w-[760px]">
              {items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                  className={cn(
                    'text-[20px] font-semibold leading-[135%] transition-colors hover:text-[#005D9A] relative h-[84px] inline-flex items-center py-[28.5px] whitespace-nowrap',
                    pathname === item.path ? 'text-[#005D9A]' : 'text-black'
                  )}
                >
                  {item.label}
                  {pathname === item.path && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[3px] bg-[#005D9A] rounded-full" />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: CTA + Language */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <button
              type="button"
              onClick={scrollToJoinSection}
              className="px-5 py-2.5 bg-[#EE334E] text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
            >
              Join 1500+ Youth Organizations
            </button>
            <Button type="text" className="!flex !items-center !gap-1.5 !px-3 !py-2 !text-sm !text-neutral-700 !h-auto">
              <Icon name="lucide:globe" size={16} />
              English
              <Icon name="lucide:chevron-down" size={14} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
