import { Link, useLocation } from 'react-router-dom';
import { Drawer, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/layout/Logo';
import { Icon } from '@/components/ui/Icon';
import { ICONS } from '@/config/icons';
import { useDisclosure } from '@/hooks';
import { useJoinModal } from '@/components/modals/JoinModal';
import { useLanguage } from '@/context/LanguageContext';
import { ROUTES } from '@/routes/paths';

export function HeaderMobile() {
  const { pathname } = useLocation();
  const { isOpen, open, close } = useDisclosure();
  const { openJoin } = useJoinModal();
  const { language, setLanguage, t } = useLanguage();

  const handleDrawerJoinClick = () => {
    close();
    openJoin();
  };

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
        <div className="flex items-center justify-between gap-4 py-1.5 px-2">
          <span className="flex items-center gap-2">
            <span>🇬🇧</span> English
          </span>
          {language === 'en' && <CheckOutlined className="text-[#005D9A]" />}
        </div>
      ),
      onClick: () => setLanguage('en'),
    },
    {
      key: 'vi',
      label: (
        <div className="flex items-center justify-between gap-4 py-1.5 px-2">
          <span className="flex items-center gap-2">
            <span>🇻🇳</span> Tiếng Việt
          </span>
          {language === 'vi' && <CheckOutlined className="text-[#005D9A]" />}
        </div>
      ),
      onClick: () => setLanguage('vi'),
    },
  ];

  return (
    <header className="lg:hidden sticky top-0 z-50 bg-white border-b border-neutral-100">
      <div className="px-4 pb-3 pt-2 sm:px-6">
        <div className="flex h-12 items-center justify-between gap-3">
          <Logo className="max-w-[132px] flex-shrink-0 sm:max-w-[148px]" />
          <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
            <Dropdown menu={{ items: languageMenuItems }} trigger={['click']} placement="bottomRight">
              <button
                type="button"
                className="flex items-center gap-1 font-medium text-black transition-colors hover:text-[#005D9A] py-1 px-2 rounded-md hover:bg-neutral-50"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              >
                <Icon name="lucide:globe" size={18} />
                <span className="text-sm font-semibold">{language.toUpperCase()}</span>
                <Icon name="lucide:chevron-down" size={14} />
              </button>
            </Dropdown>

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
          onClick={openJoin}
          className="mt-2 w-full whitespace-nowrap rounded-full bg-[#EE334E] px-4 py-3 text-[15px] font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] sm:text-base"
          style={{ fontFamily: 'Open Sans, sans-serif' }}
        >
          {t.nav.joinCta}
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
          {navItems.map((item) => {
            const active = pathname.startsWith(item.path);
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
            onClick={handleDrawerJoinClick}
            className="w-full rounded-full bg-[#EE334E] px-4 py-3 text-[15px] font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] sm:text-[16px]"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            {t.nav.joinCta}
          </button>
        </div>
      </Drawer>
    </header>
  );
}