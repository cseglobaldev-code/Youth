import { Link, useLocation } from 'react-router-dom';
import { Drawer } from 'antd';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/layout/Logo';
import { Icon } from '@/components/ui/Icon';
import { ICONS } from '@/config/icons';
import { useDisclosure, useJoinNavigation } from '@/hooks';
import { NAV_ITEMS } from '@/data';
import type { NavItem } from '@/types';

interface HeaderMobileProps {
  navItems?: NavItem[];
  className?: string;
}

export function HeaderMobile({ navItems, className }: HeaderMobileProps) {
  const items = navItems ?? NAV_ITEMS;
  const { pathname } = useLocation();
  const { isOpen, open, close } = useDisclosure();
  const goToJoin = useJoinNavigation();

  const handleJoinClick = () => {
    close();
    goToJoin();
  };

  return (
    <header
      className={cn(
        'lg:hidden sticky top-0 z-50 bg-white border-b border-neutral-100',
        className
      )}
    >
      <div className="px-4 pb-3 pt-2 sm:px-6">
        <div className="flex h-12 items-center justify-between gap-3">
          <Logo className="max-w-[132px] flex-shrink-0 sm:max-w-[148px]" />
          <div className="flex flex-shrink-0 items-center gap-3 sm:gap-4">
            <button
              type="button"
              className="flex items-center gap-1.5 font-medium text-black transition-colors hover:text-[#005D9A]"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            >
              <Icon name="lucide:globe" size={18} />
              English
              <Icon name="lucide:chevron-down" size={16} />
            </button>
            <button
              type="button"
              onClick={open}
              aria-label="Open menu"
              className="rounded-lg p-1 text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-[#005D9A]"
            >
              <Icon name={ICONS.menu} size={24} />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={goToJoin}
          className="mt-2 w-full whitespace-nowrap rounded-full bg-[#EE334E] px-4 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.99] sm:text-base"
          style={{ fontFamily: 'Open Sans, sans-serif' }}
        >
          Join 1500+ Youth Organizations
        </button>
      </div>

      <Drawer
        open={isOpen}
        onClose={close}
        placement="right"
        width="min(320px, 86vw)"
        title={<Logo className="max-w-[148px]" />}
        closable
        styles={{ body: { padding: '16px' } }}
      >
        <nav className="flex flex-col gap-1">
          {items.map((item) => {
            const active = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={close}
                style={{ fontFamily: 'Open Sans, sans-serif' }}
                className={cn(
                  'rounded-xl px-4 py-3 text-[15px] font-semibold transition-all duration-200 sm:text-[16px]',
                  active
                    ? 'bg-[#EBF4FA] text-[#005D9A]'
                    : 'text-neutral-800 hover:bg-neutral-50 hover:text-[#005D9A]'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 border-t border-neutral-100 pt-4">
          <button
            type="button"
            onClick={handleJoinClick}
            className="w-full rounded-full bg-[#EE334E] px-4 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 sm:text-[16px]"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            Join 1500+ Youth Organizations
          </button>
        </div>
      </Drawer>
    </header>
  );
}
