import { Link, useLocation } from 'react-router-dom';
import { Button, Drawer } from 'antd';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/layout/Logo';
import { Icon } from '@/components/ui/Icon';
import { ICONS } from '@/config/icons';
import { useDisclosure } from '@/hooks';
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

  return (
    <header
      className={cn(
        'lg:hidden sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-100',
        className
      )}
    >
      <Container>
        <div className="flex items-center justify-between h-14">
          <Logo />
          <Button type="text" className="!p-2 !text-neutral-700 !h-auto" onClick={open} aria-label="Open menu">
            <Icon name={ICONS.menu} size={24} />
          </Button>
        </div>
      </Container>

      <Drawer
        open={isOpen}
        onClose={close}
        placement="right"
        width={280}
        title={<Logo />}
        closable
      >
        <nav className="flex flex-col gap-1">
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={close}
              className={cn(
                'px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                pathname === item.path
                  ? 'bg-brand-50 text-brand'
                  : 'text-neutral-700 hover:bg-neutral-50'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Drawer>
    </header>
  );
}
