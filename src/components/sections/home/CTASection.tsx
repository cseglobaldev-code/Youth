export function CTASection() {
  return (
    <section className="mx-[288px] my-[60px] rounded-[40px] overflow-hidden relative" style={{ background: 'linear-gradient(to right, #E8A0A0, #A8D8B0, #A0C8E8)' }}>
      <div className="px-[60px] py-[40px] flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-[36px] text-[#111111] mb-2" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Ready to Make an Impact?
          </h2>
          <p className="text-[18px] text-[#333333] font-normal" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Join thousands of youth leaders across ASEAN who are making a difference in their communities.
          </p>
        </div>
        <button className="px-8 py-3 border-2 border-[#EE334E] text-[#EE334E] text-[18px] font-semibold rounded-full hover:bg-[#EE334E] hover:text-white transition-colors flex-shrink-0" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          Register Now
        </button>
      </div>
    </section>
  );
}
