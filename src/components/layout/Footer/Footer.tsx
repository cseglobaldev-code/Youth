// src/components/layout/Footer/Footer.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { ICONS } from '@/config/icons';
import { ROUTES } from '@/routes/paths';
import { StrapiService } from '@/lib/strapi';
import type { SocialLink } from '@/types';

export interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const [globalSetting, setGlobalSetting] = useState<any>(null);

  useEffect(() => {
    StrapiService.getGlobalSetting()
      .then((data) => {
        if (data) setGlobalSetting(data);
      })
      .catch((err) => console.error('Error fetching global settings for footer:', err));
  }, []);

  const email = globalSetting?.email || 'info@youthorgunion.org';
  const phone = globalSetting?.phone || '098.242.1109';
  const address = globalSetting?.address || 'Global - Operating across 6 continents';
  const socialLinks: SocialLink[] = globalSetting?.socialLinks || [
    { platform: 'youtube', url: '#' },
    { platform: 'facebook', url: '#' },
    { platform: 'twitter', url: '#' },
    { platform: 'instagram', url: '#' },
    { platform: 'linkedin', url: '#' },
  ];

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
                letterSpacing: '0%',
              }}
            >
              Infomation
            </h4>
            <div className="flex flex-col gap-3 lg:gap-4" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              <div className="flex items-start gap-3 text-sm font-normal text-neutral-300 sm:text-base lg:text-[20px]">
                <Icon name="lucide:map-pin" size={18} className="mt-0.5 shrink-0 text-blue-400" />
                <span>{address}</span>
              </div>
              <a
                href={`tel:${phone}`}
                className="flex items-start gap-3 text-sm font-normal text-neutral-300 transition-colors hover:text-[#005D9A] sm:text-base lg:text-[20px]"
              >
                <Icon name="lucide:phone" size={18} className="mt-0.5 shrink-0 text-blue-400" />
                <span>{phone}</span>
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-start gap-3 text-sm font-normal text-neutral-300 transition-colors hover:text-[#005D9A] sm:text-base lg:text-[20px]"
              >
                <Icon name="lucide:mail" size={18} className="mt-0.5 shrink-0 text-blue-400" />
                <span className="break-all sm:break-normal">{email}</span>
              </a>
              <div className="flex items-start gap-3 text-sm font-normal text-neutral-300 sm:text-base lg:text-[20px]">
                <Icon name="lucide:calendar" size={18} className="mt-0.5 shrink-0 text-blue-400" />
                <span>Within 5-7 business days</span>
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
                letterSpacing: '0%',
              }}
            >
              Discover
            </h4>
            <nav className="flex flex-col items-start gap-3">
              <Link
                to={ROUTES.ABOUT}
                className="text-white transition-colors hover:text-[#005D9A]"
                style={{
                  fontFamily: 'Open Sans, sans-serif',
                  fontWeight: 400,
                  fontSize: '20px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  verticalAlign: 'middle',
                }}
              >
                About us
              </Link>
              <Link
                to={ROUTES.LEADERSHIP}
                className="text-white transition-colors hover:text-[#005D9A]"
                style={{
                  fontFamily: 'Open Sans, sans-serif',
                  fontWeight: 400,
                  fontSize: '20px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  verticalAlign: 'middle',
                }}
              >
                Leadership
              </Link>
              <Link
                to={ROUTES.MEMBERS}
                className="text-white transition-colors hover:text-[#005D9A]"
                style={{
                  fontFamily: 'Open Sans, sans-serif',
                  fontWeight: 400,
                  fontSize: '20px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  verticalAlign: 'middle',
                }}
              >
                Members
              </Link>
              <Link
                to={ROUTES.PROJECTS}
                className="text-white transition-colors hover:text-[#005D9A]"
                style={{
                  fontFamily: 'Open Sans, sans-serif',
                  fontWeight: 400,
                  fontSize: '20px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  verticalAlign: 'middle',
                }}
              >
                Projects
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-neutral-700 py-5 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-neutral-400">
            © 2026 Youth Organization Union · All rights reserved
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-end lg:gap-6">
            <a href="#" className="text-xs text-white transition-colors hover:text-[#005D9A]">
              Terms of Service
            </a>
            <a href="#" className="text-xs text-white transition-colors hover:text-[#005D9A]">
              Privacy Policy
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}