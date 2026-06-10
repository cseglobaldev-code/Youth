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
      <div className="flex h-[72px] xl:h-[84px] items-center justify-between gap-4 px-6 xl:px-10 2xl:px-[90px]">
        <div className="flex min-w-0 items-center gap-6 xl:gap-10 2xl:gap-[60px]">
          <Logo className="flex-shrink-0" />

          <nav className="flex min-w-0 items-center gap-5 xl:gap-8 2xl:gap-[44px]">
            {items.map((item) => {
              const active = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                  className={cn(
                    'relative inline-flex h-[72px] xl:h-[84px] items-center whitespace-nowrap text-[15px] xl:text-[17px] 2xl:text-[20px] font-semibold leading-[135%] transition-colors hover:text-[#005D9A]',
                    active ? 'text-[#005D9A]' : 'text-black'
                  )}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 h-[2px] w-8 -translate-x-1/2 rounded-full bg-[#005D9A] xl:w-[38px]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-shrink-0 items-center gap-3 xl:gap-5 2xl:gap-6">
          <button
            type="button"
            onClick={goToJoin}
            className="whitespace-nowrap rounded-full bg-[#EE334E] px-4 py-2.5 text-[14px] font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] xl:px-5 xl:text-[16px] 2xl:px-[28px] 2xl:py-3 2xl:text-[18px]"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            <span className="2xl:hidden">Join 1500+</span>
            <span className="hidden 2xl:inline">Join 1500+ Youth Organizations</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 text-[15px] font-medium text-black transition-colors hover:text-[#005D9A] xl:gap-[8px] xl:text-[17px] 2xl:text-[20px]"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            <Icon name="lucide:globe" size={18} />
            English
            <Icon name="lucide:chevron-down" size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
