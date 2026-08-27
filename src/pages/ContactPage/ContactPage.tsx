import { useRef, type FormEvent, useState } from 'react';
import { message } from 'antd';
import { Container } from '@/components/ui/Container';
import { PillButton } from '@/components/ui/PillButton';
import { Icon } from '@/components/ui/Icon';
import { ICONS } from '@/config/icons';
import { submitInquiry, type Inquiry } from '@/api/inquiries';
import { DIAL_CODES } from '@/data/dialCodes';
import { countryFlagEmoji } from '@/lib/utils';

const CONTACT_REASONS = [
  'Partnership',
  'Recognition',
  'Investment & Sponsor',
  'Application for a role',
  'Suggestion',
  'Complaint',
  'Others',
];

const FONT = { fontFamily: 'Open Sans, sans-serif' };

const inputClasses =
  'h-14 w-full rounded-[16px] border border-[#D9D9D9] bg-white px-4 text-base text-[#151515] outline-none transition focus:border-[#EE334E] focus:ring-2 focus:ring-[#EE334E]/10';

const labelClasses = 'mb-3 block text-[16px] font-normal leading-[140%] text-[#151515]';

export function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [dialCode, setDialCode] = useState(DIAL_CODES[0].code);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const phoneNumber = String(formData.get('phone') ?? '').trim();

    const inquiry: Inquiry = {
      name: String(formData.get('name')),
      email: String(formData.get('email')),
      phone: phoneNumber ? `${dialCode} ${phoneNumber}` : '',
      reason: String(formData.get('reason')),
      message: String(formData.get('message')),
    };

    try {
      setLoading(true);
      await submitInquiry(inquiry);
      message.success('Thank you! Your inquiry has been submitted.');
      formRef.current?.reset();
    } catch (error) {
      message.error('Failed to submit inquiry. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
                  Phone number
                </label>
                <div className="flex gap-2">
                  <div className="relative w-[112px] shrink-0">
                    <select
                      aria-label="Country code"
                      value={dialCode}
                      onChange={(e) => setDialCode(e.target.value)}
                      className={`${inputClasses} w-full appearance-none !pl-3 !pr-8`}
                    >
                      {DIAL_CODES.map((d) => (
                        <option key={d.country} value={d.code} title={d.country}>
                          {countryFlagEmoji(d.country)} {d.code}
                        </option>
                      ))}
                    </select>
                    <Icon
                      name={ICONS.chevronDown}
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
                    />
                  </div>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className={`${inputClasses} flex-1`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-reason" className={labelClasses}>
                  Reason for Contacting <span className="text-[#EE334E]">*</span>
                </label>
                <select
                  id="contact-reason"
                  name="reason"
                  required
                  defaultValue=""
                  className={inputClasses}
                >
                  <option value="" disabled>
                    Select a reason
                  </option>
                  {CONTACT_REASONS.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
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
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </PillButton>
          </form>
        </section>
      </Container>
    </div>
  );
}
