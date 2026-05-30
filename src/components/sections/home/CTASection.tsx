import { Container } from '@/components/ui/Container';

export function CTASection() {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Dark background with subtle texture */}
      <div className="absolute inset-0 bg-neutral-900 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/40 to-transparent" />
      </div>

      <Container className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-[774px]">
            <h2 className="font-heading font-bold text-3xl lg:text-5xl text-white mb-4">
              Ready to Make an Impact?
            </h2>
            <p className="text-white/70 text-base leading-relaxed max-w-[562px]">
              Join thousands of youth leaders across ASEAN who are making a difference in their
              communities.
            </p>
          </div>
          <div className="flex-shrink-0">
            <button className="px-8 py-4 bg-white text-brand font-semibold rounded-xl hover:bg-neutral-100 transition-colors text-base">
              Register Now
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
