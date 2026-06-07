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
      <div className="flex items-center justify-between h-14 px-4 sm:px-6">
        <Logo />
        <button
          type="button"
          onClick={open}
          aria-label="Open menu"
          className="p-2 text-neutral-700 hover:text-[#005D9A] transition-colors rounded-lg hover:bg-neutral-50"
        >
          <Icon name={ICONS.menu} size={24} />
        </button>
      </div>

      <Drawer
        open={isOpen}
        onClose={close}
        placement="right"
        width={280}
        title={<Logo />}
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
                  'px-4 py-3 rounded-xl text-[16px] font-semibold transition-all duration-200',
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

        <div className="mt-6 pt-4 border-t border-neutral-100">
          <button
            type="button"
            onClick={handleJoinClick}
            className="w-full px-5 py-3 bg-[#EE334E] text-white text-[16px] font-semibold rounded-full hover:opacity-90 transition-opacity"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            Join 1500+ Youth Organizations
          </button>
        </div>
      </Drawer>
    </header>
  );
}
