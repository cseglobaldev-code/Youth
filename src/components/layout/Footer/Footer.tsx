import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { ICONS } from '@/config/icons';
import { SOCIAL_LINKS } from '@/data';
import { ROUTES } from '@/routes/paths';
import { fetchGlobalSettings, DEFAULT_GLOBAL_SETTINGS } from '@/api/global';
import type { GlobalSetting } from '@/types';

export interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const [settings, setSettings] = useState<GlobalSetting>(DEFAULT_GLOBAL_SETTINGS);

  useEffect(() => {
    const controller = new AbortController();
    fetchGlobalSettings({ signal: controller.signal })
      .then(setSettings)
      .catch(() => setSettings(DEFAULT_GLOBAL_SETTINGS));

    return () => controller.abort();
  }, []);

  const socialLinks = settings.socialLinks && settings.socialLinks.length > 0 ? settings.socialLinks : SOCIAL_LINKS;

  return (
    <footer className={cn('bg-[#0B1A2B] text-white', className)}>
      <Container>
        <div className="grid grid-cols-1 gap-8 py-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10 lg:py-16">
          {/* Logo + Social */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <Link to={ROUTES.HOME} aria-label="Y.O.U Home">
              <img
                src="/images/common/brand/footer-logo.svg"
                alt="Youth Organization Union"
                className="h-auto w-[168px] object-contain sm:w-[190px] lg:w-[225px]"
              />
            </Link>
            <div className="mt-5 flex w-[168px] items-center justify-center gap-4 sm:mt-6 sm:w-[190px] lg:w-[225px]">
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white transition-opacity hover:opacity-75"
                  aria-label={link.platform === 'twitter' ? 'X' : link.platform}
                >
                  <Icon name={link.platform === 'twitter' ? 'fa6-brands:x-twitter' : ICONS[link.platform]} size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Information */}
          <div className="min-w-0">
            <h4
              className="mb-4 text-white lg:mb-5"
              style={{
                fontFamily: 'Open Sans, sans-serif',
                fontWeight: 600,
                fontSize: '24px',
                lineHeight: '140%',
              }}
            >
              Information
            </h4>
            <div className="flex flex-col gap-3 lg:gap-4" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              <div className="flex items-start gap-3 text-base font-normal text-neutral-300">
                <Icon name="lucide:map-pin" size={18} className="mt-0.5 shrink-0 text-blue-400" />
                <span>{settings.address}</span>
              </div>
              <a
                href={`mailto:${settings.email}`}
                className="flex items-start gap-3 text-base font-normal text-neutral-300 transition-colors hover:text-[#005D9A]"
              >
                <Icon name="lucide:mail" size={18} className="mt-0.5 shrink-0 text-blue-400" />
                <span className="break-all sm:break-normal">{settings.email}</span>
              </a>
              <div className="flex items-start gap-3 text-base font-normal text-neutral-300">
                <Icon name="lucide:calendar" size={18} className="mt-0.5 shrink-0 text-blue-400" />
                <span>{settings.operatingTime}</span>
              </div>
            </div>
          </div>

          {/* Discover */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4
              className="mb-4 text-white lg:mb-5"
              style={{
                fontFamily: 'Open Sans, sans-serif',
                fontWeight: 600,
                fontSize: '24px',
                lineHeight: '140%',
              }}
            >
              Discover
            </h4>
            <nav className="grid w-fit grid-cols-2 gap-x-10 gap-y-3">
              {[
                { to: ROUTES.ABOUT, label: 'About us' },
                { to: ROUTES.LEADERSHIP, label: 'Leadership' },
                { to: ROUTES.MEMBERS, label: 'Members' },
                { to: ROUTES.PROJECTS, label: 'Projects' },
                { to: ROUTES.POLICY_DOCUMENTS, label: 'Documents' },
                { to: ROUTES.CONTACT, label: 'Contact' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-neutral-300 transition-colors hover:text-[#005D9A]"
                  style={{
                    fontFamily: 'Open Sans, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '100%',
                    verticalAlign: 'middle',
                  }}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom bar with dynamic current year */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-neutral-700 py-5 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} Youth Organization Union · All rights reserved
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-end lg:gap-6">
            <a
              href={settings.termsOfServiceUrl || '#'}
              target={settings.termsOfServiceUrl?.startsWith('http') ? '_blank' : undefined}
              rel={settings.termsOfServiceUrl?.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-xs text-white transition-colors hover:text-[#005D9A]"
            >
              Terms of Service
            </a>
            <a
              href={settings.privacyPolicyUrl || '#'}
              target={settings.privacyPolicyUrl?.startsWith('http') ? '_blank' : undefined}
              rel={settings.privacyPolicyUrl?.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-xs text-white transition-colors hover:text-[#005D9A]"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}