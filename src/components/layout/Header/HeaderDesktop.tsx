import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/layout/Logo';
import { Icon } from '@/components/ui/Icon';
import { useJoinNavigation } from '@/hooks';
import { NAV_ITEMS } from '@/data';
import type { NavItem } from '@/types';

interface HeaderDesktopProps {
  navItems?: NavItem[];
  className?: string;
}

export function HeaderDesktop({ navItems, className }: HeaderDesktopProps) {
  const items = navItems ?? NAV_ITEMS;
  const { pathname } = useLocation();
  const goToJoin = useJoinNavigation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'hidden lg:block sticky top-0 z-50 bg-white transition-shadow duration-300',
        scrolled ? 'shadow-sm' : 'border-b border-neutral-100',
        className
      )}
    >
      <div className="flex items-center justify-between h-[84px] px-[90px]">
        <div className="flex items-center gap-[60px]">
          <Logo />

          <nav className="flex items-center gap-[44px]">
            {items.map((item) => {
              const active = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                  className={cn(
                    'relative text-[20px] font-semibold leading-[135%] h-[84px] inline-flex items-center whitespace-nowrap transition-colors hover:text-[#005D9A]',
                    active ? 'text-[#005D9A]' : 'text-black'
                  )}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[38px] h-[2px] bg-[#005D9A] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-6 flex-shrink-0">
          <button
            type="button"
            onClick={goToJoin}
            className="px-[28px] py-3 bg-[#EE334E] text-white text-[18px] font-semibold rounded-full hover:opacity-90 active:scale-[0.98] transition-all duration-200 whitespace-nowrap"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            Join 1500+ Youth Organizations
          </button>

          <button
            type="button"
            className="flex items-center gap-[8px] text-[20px] font-medium text-black hover:text-[#005D9A] transition-colors"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            <Icon name="lucide:globe" size={20} />
            English
            <Icon name="lucide:chevron-down" size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}