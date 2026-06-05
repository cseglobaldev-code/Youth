import { CTABanner } from '@/components/common/CTABanner';

export function CTASection() {
  const handleClick = () => {
    const el = document.getElementById('join-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <CTABanner
      title="Ready to Make an Impact?"
      description="Join thousands of youth leaders across ASEAN who are making a difference in their communities."
      ctaLabel="Register Now"
      onCtaClick={handleClick}
    />
  );
}
