import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/layout/Logo';
import { Icon } from '@/components/ui/Icon';
import { useJoinModal } from '@/components/modals/JoinModal';
import { useLanguage } from '@/context/LanguageContext';
import { ROUTES } from '@/routes/paths';

export function HeaderDesktop() {
  const { pathname } = useLocation();
  const { openJoin } = useJoinModal();
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: t.nav.about, path: ROUTES.ABOUT },
    { label: t.nav.leadership, path: ROUTES.LEADERSHIP },
    { label: t.nav.members, path: ROUTES.MEMBERS },
    { label: t.nav.projects, path: ROUTES.PROJECTS },
    { label: t.nav.documents, path: ROUTES.POLICY_DOCUMENTS },
    { label: t.nav.contact, path: ROUTES.CONTACT },
  ];

  const languageMenuItems: MenuProps['items'] = [
    {
      key: 'en',
      label: (
        <div className="flex items-center justify-between gap-4 py-1 px-1">
          <span className="flex items-center gap-2 text-[14px]">
            <span className="text-[18px]">🇬🇧</span> English
          </span>
          {language === 'en' && <CheckOutlined className="text-[#005D9A]" />}
        </div>
      ),
      onClick: () => setLanguage('en'),
    },
    {
      key: 'vi',
      label: (
        <div className="flex items-center justify-between gap-4 py-1 px-1">
          <span className="flex items-center gap-2 text-[14px]">
            <span className="text-[18px]">🇻🇳</span> Tiếng Việt
          </span>
          {language === 'vi' && <CheckOutlined className="text-[#005D9A]" />}
        </div>
      ),
      onClick: () => setLanguage('vi'),
    },
  ];

  return (
    <header
      className={cn(
        'hidden lg:block sticky top-0 z-50 bg-white transition-shadow duration-300',
        scrolled ? 'shadow-sm' : 'border-b border-neutral-100'
      )}
    >
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
            {navItems.map((item) => {
              const active = pathname.startsWith(item.path);
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
            <span className="xl:hidden">{t.nav.joinCtaShort}</span>
            <span className="hidden xl:inline">{t.nav.joinCta}</span>
          </button>

          <Dropdown menu={{ items: languageMenuItems }} trigger={['click']} placement="bottomRight">
            <button
              type="button"
              className="flex items-center gap-1.5 font-medium text-black transition-colors hover:text-[#005D9A] cursor-pointer py-1.5 px-2 rounded-lg hover:bg-neutral-50"
              style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: 'clamp(0.875rem, 0.55vw + 0.55rem, 1.25rem)',
              }}
              aria-label="Select Language"
            >
              <Icon name="lucide:globe" size={18} />
              <span className="hidden min-[1100px]:inline">
                {language === 'vi' ? 'Tiếng Việt' : 'English'}
              </span>
              <Icon name="lucide:chevron-down" size={14} className="opacity-70" />
            </button>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}