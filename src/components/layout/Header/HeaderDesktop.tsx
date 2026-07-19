import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/layout/Logo';
import { Icon } from '@/components/ui/Icon';
import { useJoinModal } from '@/components/modals/JoinModal';
import { NAV_ITEMS } from '@/data';
import type { NavItem } from '@/types';

interface HeaderDesktopProps {
  navItems?: NavItem[];
  className?: string;
}

export function HeaderDesktop({ navItems, className }: HeaderDesktopProps) {
  const items = navItems ?? NAV_ITEMS;
  const { pathname } = useLocation();
  const { openJoin } = useJoinModal();
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
      {/* Fluid row: padding/gaps scale with viewport instead of fixed px steps */}
      <div
        className="mx-auto flex h-[clamp(3.75rem,5.5vw,5.25rem)] w-full max-w-[1920px] items-center justify-between gap-[clamp(0.75rem,1.5vw,1.5rem)]"
        style={{
          paddingInline: 'clamp(1rem, 4.5vw, 5.625rem)',
        }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-[clamp(1rem,2.5vw,3.75rem)]">
          <Logo className="h-8 w-auto shrink-0 xl:h-9" />

          <nav
            className="flex min-w-0 flex-1 items-center justify-start overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ gap: 'clamp(0.75rem, 1.8vw, 2.75rem)' }}
            aria-label="Primary"
          >
            {items.map((item) => {
              const active = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    fontFamily: 'Open Sans, sans-serif',
                    fontSize: 'clamp(0.875rem, 0.55vw + 0.55rem, 1.25rem)',
                  }}
                  className={cn(
                    'relative inline-flex h-[clamp(3.75rem,5.5vw,5.25rem)] shrink-0 items-center whitespace-nowrap font-semibold leading-[135%] transition-colors hover:text-[#005D9A]',
                    active ? 'text-[#005D9A]' : 'text-black'
                  )}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 h-[2px] w-[clamp(1.5rem,2vw,2.375rem)] -translate-x-1/2 rounded-full bg-[#005D9A]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div
          className="flex shrink-0 items-center"
          style={{ gap: 'clamp(0.5rem, 1.2vw, 1.5rem)' }}
        >
          <button
            type="button"
            onClick={openJoin}
            className="whitespace-nowrap rounded-full bg-[#EE334E] font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{
              fontFamily: 'Open Sans, sans-serif',
              fontSize: 'clamp(0.75rem, 0.45vw + 0.5rem, 1.125rem)',
              paddingInline: 'clamp(0.75rem, 1.4vw, 1.75rem)',
              paddingBlock: 'clamp(0.4rem, 0.7vw, 0.75rem)',
            }}
          >
            {/* Short label on tight desktops; full CTA when there is room */}
            <span className="xl:hidden">Join Y.O.U</span>
            <span className="hidden xl:inline">Join 1500+ Youth Organizations</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-1 font-medium text-black transition-colors hover:text-[#005D9A] xl:gap-1.5"
            style={{
              fontFamily: 'Open Sans, sans-serif',
              fontSize: 'clamp(0.875rem, 0.55vw + 0.55rem, 1.25rem)',
            }}
            aria-label="Language: English"
          >
            <Icon name="lucide:globe" size={18} />
            <span className="hidden min-[1100px]:inline">English</span>
            <Icon name="lucide:chevron-down" size={16} className="hidden min-[1100px]:block" />
          </button>
        </div>
      </div>
    </header>
  );
}
