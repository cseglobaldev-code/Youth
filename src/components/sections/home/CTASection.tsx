export function CTASection() {
  return (
    <section className="mx-[288px] my-[60px] rounded-[24px] overflow-hidden relative" style={{ background: 'linear-gradient(to right, #E8A0A0, #F5D0A0, #A8D8A0, #A0C8D8, #B0C0E0)' }}>
      <div className="px-[60px] py-[40px] flex items-center justify-between relative z-10">
        {/* Left: text */}
        <div>
          <h2 className="font-semibold text-[32px] text-[#111111] mb-2" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Ready to Make an Impact?
          </h2>
          <p className="text-[18px] text-[#333333] font-normal max-w-[450px]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Join thousands of youth leaders across ASEAN who are making a difference in their communities.
          </p>
        </div>

        {/* Right: button */}
        <button className="px-8 py-3 border-2 border-[#EE334E] text-[#EE334E] text-[18px] font-semibold rounded-full bg-white/80 hover:bg-[#EE334E] hover:text-white transition-colors" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          Register Now
        </button>
      </div>

      {/* Decorative star shapes */}
      <div className="absolute top-4 left-8 text-[#111111]/20 text-3xl">✦</div>
      <div className="absolute bottom-6 left-[30%] text-[#111111]/10 text-2xl">✦</div>
      <div className="absolute top-1/2 right-[35%] text-white/30 text-4xl">✦</div>
    </section>
  );
}
