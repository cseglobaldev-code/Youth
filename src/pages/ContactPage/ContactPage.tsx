import { useEffect, useRef, useState, type FormEvent } from 'react';
import { message } from 'antd';
import { Container } from '@/components/ui/Container';
import { PillButton } from '@/components/ui/PillButton';
import { Icon } from '@/components/ui/Icon';
import { ICONS, SOCIAL_COLORS } from '@/config/icons';
import { StrapiService } from '@/lib/strapi';
import type { SocialLink } from '@/types';

const FONT = { fontFamily: 'Open Sans, sans-serif' };

const DEFAULT_ADDRESS = 'No.53, Lane 215, Dinh Cong Thuong, Dinh Cong, Hoang Mai, Hanoi, Vietnam';
const DEFAULT_PHONE = '(+84) 98.242.1109';
const DEFAULT_EMAIL = 'info@youthorgunion.org';
const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { platform: 'instagram', url: '#' },
  { platform: 'facebook', url: '#' },
  { platform: 'youtube', url: '#' },
];

const inputClasses =
  'h-14 w-full rounded-[16px] border border-[#D9D9D9] bg-white px-4 text-base text-[#151515] outline-none transition focus:border-[#EE334E] focus:ring-2 focus:ring-[#EE334E]/10';

const labelClasses = 'mb-3 block text-[16px] font-normal leading-[140%] text-[#151515]';
const socialItemClasses =
  'inline-flex h-6 w-6 items-center justify-center rounded-full bg-white transition-transform duration-200 hover:scale-105';

function toTelHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, '');
  return digits.startsWith('+') ? `tel:${digits}` : `tel:+${digits.replace(/^0/, '84')}`;
}

export function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [globalSetting, setGlobalSetting] = useState<any>(null);

  useEffect(() => {
    StrapiService.getGlobalSetting()
      .then((data) => {
        if (data) setGlobalSetting(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const values = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      reason: formData.get('reason'),
      message: formData.get('message'),
    };

    try {
      await StrapiService.submitInquiry(values);
      message.success('Cảm ơn bạn! Thông tin liên hệ đã được gửi thành công.');
      formRef.current.reset();
    } catch (err) {
      console.error(err);
      message.error('Không thể gửi thông tin. Vui lòng kiểm tra lại kết nối mạng.');
    }
  };

  const email = globalSetting?.email || DEFAULT_EMAIL;
  const phone = globalSetting?.phone || DEFAULT_PHONE;
  const address = globalSetting?.address || DEFAULT_ADDRESS;
  const socialLinks: SocialLink[] = (globalSetting?.socialLinks || DEFAULT_SOCIAL_LINKS).filter(
    (link: SocialLink) => Boolean(ICONS[link.platform] && SOCIAL_COLORS[link.platform]),
  );

  const contactDetails = [
    {
      title: 'Address',
      content: [address],
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
      openInNewTab: true,
    },
    {
      title: 'Hotline/WhatsApp/Zalo',
      content: [phone],
      href: toTelHref(phone),
      openInNewTab: false,
    },
    {
      title: 'Email',
      content: [email],
      href: `mailto:${email}`,
      openInNewTab: false,
    },
  ] as const;

  return (
    <div className="relative z-10 pb-16 pt-10 md:pb-24 md:pt-16 lg:pb-[120px] lg:pt-[96px]" style={FONT}>
      <Container className="max-w-[1180px]">
        <section className="mx-auto max-w-[980px] text-center">
          <h1 className="text-[clamp(2.75rem,5vw,5rem)] font-semibold leading-[1.08] text-black">
            Contact{' '}
            <span className="bg-gradient-to-r from-[#EE334E] via-[#FCB131] to-[#00A651] bg-clip-text text-transparent">
              Y.O.U
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-[860px] text-[clamp(1rem,1.45vw,1.625rem)] leading-[1.45] text-[#151515]">
            We are always ready to listen and answer any questions you may have.
            <br className="hidden md:block" />
            Connect with us to develop groundbreaking ideas together!
          </p>
        </section>

        <section className="mx-auto mt-12 max-w-[1144px] md:mt-16 lg:mt-[72px]">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 md:space-y-7">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
              <div>
                <label htmlFor="contact-name" className={labelClasses}>
                  Your Name <span className="text-[#EE334E]">*</span>
                </label>
                <input id="contact-name" name="name" autoComplete="name" required className={inputClasses} />
              </div>

              <div>
                <label htmlFor="contact-email" className={labelClasses}>
                  Email Address <span className="text-[#EE334E]">*</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={inputClasses}
                />
              </div>

              <div>
                <label htmlFor="contact-phone" className={labelClasses}>
                  Phone number <span className="text-[#EE334E]">*</span>
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  className={inputClasses}
                />
              </div>

              <div>
                <label htmlFor="contact-reason" className={labelClasses}>
                  Reason for Contacting <span className="text-[#EE334E]">*</span>
                </label>
                <input id="contact-reason" name="reason" required className={inputClasses} />
              </div>
            </div>

            <div>
              <label htmlFor="contact-message" className={labelClasses}>
                Your message <span className="text-[#EE334E]">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                autoComplete="off"
                required
                rows={5}
                className="min-h-[124px] w-full rounded-[16px] border border-[#D9D9D9] bg-white px-4 py-4 text-base text-[#151515] outline-none transition focus:border-[#EE334E] focus:ring-2 focus:ring-[#EE334E]/10"
              />
            </div>

            <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
            <PillButton
              variant="solid"
              size="lg"
              onClick={() => formRef.current?.requestSubmit()}
              className="min-w-[176px] px-10"
            >
              Submit
            </PillButton>
          </form>
        </section>

        <section className="mx-auto mt-12 max-w-[1144px] md:mt-16 lg:mt-[80px]">
          <div className="overflow-hidden rounded-[28px] border border-[#EE334E] bg-white">
            <div className="px-6 py-7 md:px-10 md:py-8 lg:px-[30px] lg:py-[34px]">
              <h2 className="text-[clamp(1.375rem,2vw,2.25rem)] font-semibold leading-[1.35] text-[#151515]">
                Should you need any additional details, please contact us at your convenience.
              </h2>

              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {contactDetails.map((item) => (
                  <div key={item.title} className="min-w-0">
                    <h3 className="text-[20px] font-semibold leading-[140%] text-[#151515]">
                      {item.title}
                    </h3>
                    <a
                      href={item.href}
                      target={item.openInNewTab ? '_blank' : undefined}
                      rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                      className="mt-3 block space-y-1 text-[16px] leading-[1.55] text-[#151515] transition-colors duration-200 hover:text-[#005D9A]"
                    >
                      {item.content.map((line) => (
                        <p key={line} className="break-words">
                          {line}
                        </p>
                      ))}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#F6CDD5] bg-[#FFF1F4] px-6 py-4 md:px-10 lg:px-[30px]">
              <div className="flex flex-wrap items-center gap-5">
                {socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.platform}
                    className={socialItemClasses}
                  >
                    <Icon name={ICONS[link.platform]} size={16} color={SOCIAL_COLORS[link.platform]} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
