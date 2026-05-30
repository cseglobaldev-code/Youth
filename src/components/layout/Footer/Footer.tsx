import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { ICONS } from '@/config/icons';
import { Logo } from '@/components/layout/Logo';
import { NAV_ITEMS, SOCIAL_LINKS } from '@/data';
import { siteConfig } from '@/config/site';

export interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn('bg-neutral-900 text-white', className)}>
      <Container>
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Logo invert className="mb-4" />
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm mt-3">
              {siteConfig.description}
            </p>
            <div className="flex items-center gap-4 mt-6">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white transition-colors"
                  aria-label={link.platform}
                >
                  <Icon name={ICONS[link.platform]} size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-neutral-300 mb-5">
              Navigation
            </h4>
            <nav className="flex flex-col gap-3">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-sm text-neutral-400 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-neutral-300 mb-5">
              Contact
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <Icon name={ICONS.mail} size={16} />
                {siteConfig.contact.email}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} {siteConfig.fullName}. All rights reserved.
          </p>
          <p className="text-xs text-neutral-500">
            Empowering Youth, Transforming Communities
          </p>
        </div>
      </Container>
    </footer>
  );
}
