import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { ICONS } from '@/config/icons';
import { SOCIAL_LINKS } from '@/data';
import { ROUTES } from '@/routes/paths';

export interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn('bg-[#0B1A2B] text-white', className)}>
      <Container>
        <div className="py-12 lg:py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Logo + Social */}
          <div>
            <Link to={ROUTES.HOME} aria-label="Y.O.U Home">
              <img
                src="/footer-logo.svg"
                alt="Youth Organization Union"
                className="w-[225px] h-[100px] object-contain"
              />
            </Link>
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
                  <Icon name={ICONS[link.platform]} size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-lg font-medium text-white mb-5">
              Infomation
            </h4>
            <div className="flex flex-col gap-4" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              <div className="flex items-center gap-3 text-[20px] font-normal text-neutral-300">
                <Icon name="lucide:map-pin" size={18} className="text-blue-400 shrink-0" />
                <span>Global - Operating across 6 continents</span>
              </div>
              <div className="flex items-center gap-3 text-[20px] font-normal text-neutral-300">
                <Icon name="lucide:phone" size={18} className="text-blue-400 shrink-0" />
                <span>098.242.1109</span>
              </div>
              <div className="flex items-center gap-3 text-[20px] font-normal text-neutral-300">
                <Icon name="lucide:mail" size={18} className="text-blue-400 shrink-0" />
                <span>info@youthorgunion.org</span>
              </div>
              <div className="flex items-center gap-3 text-[20px] font-normal text-neutral-300">
                <Icon name="lucide:calendar" size={18} className="text-blue-400 shrink-0" />
                <span>Within 5-7 business days</span>
              </div>
            </div>
          </div>

          {/* Discover */}
          <div>
            <h4 className="text-lg font-medium text-white mb-5">
              Discover
            </h4>
            <nav className="flex flex-col gap-3" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              <Link
                to={ROUTES.HOME}
                className="text-[20px] font-normal text-white hover:text-[#005D9A] transition-colors"
              >
                About us
              </Link>
              <Link
                to={ROUTES.LEADERSHIP}
                className="text-[20px] font-normal text-white hover:text-[#005D9A] transition-colors"
              >
                Leadership
              </Link>
              <Link
                to={ROUTES.MEMBERS}
                className="text-[20px] font-normal text-white hover:text-[#005D9A] transition-colors"
              >
                Members
              </Link>
              <Link
                to={ROUTES.PROJECTS}
                className="text-[20px] font-normal text-white hover:text-[#005D9A] transition-colors"
              >
                Projects
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-neutral-700 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-400">
            © 2026 Youth Organization Union · All rights reserved
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-neutral-400 hover:text-[#005D9A] transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-xs text-neutral-400 hover:text-[#005D9A] transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
