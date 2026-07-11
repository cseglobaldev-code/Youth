import { CTABanner } from '@/components/common/CTABanner';
import { useJoinNavigation } from '@/hooks';

export function CTASection() {
  const goToJoin = useJoinNavigation();

  return (
    <CTABanner
      title="Ready to Make an Impact?"
      description="Join thousands of youth leaders across ASEAN who are making a difference in their communities."
      ctaLabel="Register Now"
      onCtaClick={goToJoin}
      className="lg:my-[60px]"
    />
  );
}
