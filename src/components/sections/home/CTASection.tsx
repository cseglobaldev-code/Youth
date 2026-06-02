import { PillButton } from '@/components/ui/PillButton';

const CTA_GRADIENT =
  'linear-gradient(to right, #EE334E 0%, #F14D48 7%, #F56F40 16%, #F88F39 24%, #FCB131 33%, #C3AF38 41%, #79AB42 51%, #00A651 67%, #0081C8 100%)';

export function CTASection() {
  return (
    <section className="mx-[288px] my-[60px]">
      <div className="rounded-[40px] overflow-hidden relative" style={{ background: CTA_GRADIENT }}>
        {/* White overlay to soften into pastel */}
        <div className="absolute inset-0 bg-white/45" />

        {/* Star watermark */}
        <img
          src="/start.svg"
          alt=""
          aria-hidden="true"
          className="absolute right-[200px] top-1/2 -translate-y-1/2 w-[120px] h-[120px] opacity-30 pointer-events-none"
        />

        <div className="relative px-[60px] py-[40px] flex items-center justify-between">
          <div>
            <h2 className="font-bold text-[36px] text-[#111111] mb-2" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              Ready to Make an Impact?
            </h2>
            <p className="text-[18px] text-[#333333] font-normal max-w-[460px]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              Join thousands of youth leaders across ASEAN who are making a difference in their communities.
            </p>
          </div>
          <PillButton variant="white" size="md" className="flex-shrink-0">
            Register Now
          </PillButton>
        </div>
      </div>
    </section>
  );
}
