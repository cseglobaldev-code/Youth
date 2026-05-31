const ORG_BENEFITS = [
  'Official Y.O.U member status & certification',
  'Access to global partnership network',
  'Joint project opportunities',
  'Invitation to Annual Summit & events',
];

const INDIVIDUAL_BENEFITS = [
  'Continental Director (one per continent)',
  'Country Director (one per country)',
  'Formal leadership title & credentials',
  'Access to leadership training programs',
];

export function JoinSection() {
  return (
    <section className="bg-[#F2F7FF] py-[120px] px-[288px]">
      {/* Header */}
      <div className="text-center mb-[60px]">
        <h2 className="font-semibold text-[48px] leading-tight mb-4" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          Join the{' '}
          <span className="bg-gradient-to-r from-[#E42C27] via-[#FBAB1A] to-[#10984F] bg-clip-text text-transparent">
            Movement
          </span>
        </h2>
        <p className="text-neutral-600 text-[20px] font-normal" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          Two pathways to become part of the Youth Organization Union.
        </p>
      </div>

      {/* Two cards */}
      <div className="grid grid-cols-2 gap-8">
        {/* For Organizations */}
        <div className="bg-white rounded-2xl p-10 flex flex-col">
          <span className="inline-block bg-[#EE334E] text-white text-[14px] font-medium px-4 py-1.5 rounded-full mb-5 w-fit">
            For Organizations
          </span>
          <h3 className="font-semibold text-[28px] text-[#111111] mb-3" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Organization Membership
          </h3>
          <p className="text-neutral-600 text-[18px] font-normal leading-relaxed mb-6" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Register your youth-led organization as an official Y.O.U member and gain access to a global network, joint programs, and shared resources.
          </p>

          <ul className="space-y-3 mb-8 flex-1">
            {ORG_BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3 text-[16px] text-[#111111]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                <img src="/group.svg" alt="" className="w-5 h-5" aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>

          <button className="w-full py-4 bg-[#EE334E] text-white font-semibold text-[18px] rounded-full hover:opacity-90 transition-opacity" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Register Your Organization
          </button>
        </div>

        {/* For Individuals */}
        <div className="bg-white rounded-2xl p-10 flex flex-col">
          <span className="inline-block bg-[#1771B9] text-white text-[14px] font-medium px-4 py-1.5 rounded-full mb-5 w-fit">
            For Individuals
          </span>
          <h3 className="font-semibold text-[28px] text-[#111111] mb-3" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Leadership Roles
          </h3>
          <p className="text-neutral-600 text-[18px] font-normal leading-relaxed mb-6" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Apply to serve as a Continental Director or Country Director and take on a formal leadership role within the alliance's global structure.
          </p>

          <ul className="space-y-3 mb-8 flex-1">
            {INDIVIDUAL_BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3 text-[16px] text-[#111111]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                <img src="/group.svg" alt="" className="w-5 h-5" aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>

          <button className="w-full py-4 bg-[#1771B9] text-white font-semibold text-[18px] rounded-full hover:opacity-90 transition-opacity" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Apply for a Role
          </button>
        </div>
      </div>
    </section>
  );
}
