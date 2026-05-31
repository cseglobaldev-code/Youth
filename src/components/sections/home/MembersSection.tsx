import { Icon } from '@/components/ui/Icon';

const MOCK_MEMBER = {
  name: 'YouthBridge PH',
  country: 'Philippines',
  period: '2021 → nay',
  leader: 'Maria Santos',
  tags: ['#SDG 1', '#SDG 4', '#SDG 8'],
  coverUrl: '/cover-image1.png',
  logoUrl: '/small-logo1.png',
};

// Render 6 cards from 1 mock data
const MEMBERS = Array.from({ length: 6 }, (_, i) => ({
  ...MOCK_MEMBER,
  id: `member-${i + 1}`,
  coverUrl: i % 3 === 0 ? '/cover-image1.png' : i % 3 === 1 ? '/cover-image2.png' : '/cover-image3.png',
  logoUrl: i % 3 === 0 ? '/small-logo1.png' : i % 3 === 1 ? '/small-logo2.png' : '/small-logo3.png',
  name: i % 3 === 0 ? 'YouthBridge PH' : i % 3 === 1 ? 'CSE Global' : 'Future Leaders Kenya',
}));

function MemberCard({ member }: { member: typeof MOCK_MEMBER & { id: string } }) {
  return (
    <div className="w-[426.67px] h-[456.68px] bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col">
      {/* Cover */}
      <div className="relative w-[426.67px] h-[214.68px] flex-shrink-0">
        <img
          src={member.coverUrl}
          alt={member.name}
          className="w-full h-full object-cover"
        />
        {/* Logo circle */}
        <div className="absolute bottom-[-30px] left-4 w-[80px] h-[80px] rounded-full border-4 border-white overflow-hidden bg-white shadow">
          <img src={member.logoUrl} alt={`${member.name} logo`} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-10 px-4 pb-4 flex flex-col">
        {/* Title */}
        <h3 className="font-semibold text-[24px] text-[#111111]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          {member.name}
        </h3>

        {/* Info items */}
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-4 text-[18px] font-medium text-neutral-600" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            <span className="flex items-center gap-1">
              <Icon name="mynaui:map-pin" size={18} />
              {member.country}
            </span>
            <span className="flex items-center gap-1">
              <Icon name="iconoir:clock" size={18} />
              {member.period}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[18px] font-medium text-neutral-600" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            <Icon name="solar:user-linear" size={18} />
            {member.leader}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto pt-3">
          {member.tags.map((tag) => (
            <span
              key={tag}
              className="bg-[#E3F2FD] text-[#111111] text-[18px] font-medium px-3 py-1.5 rounded"
              style={{ fontFamily: 'Open Sans, sans-serif', padding: '6px 12px' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MembersSection() {
  return (
    <section className="bg-[#F2F7FF] py-[120px] px-[288px]">
      {/* Title */}
      <h2 className="font-semibold text-[48px] leading-tight mb-[40px]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
        Member of <span className="bg-gradient-to-r from-[#E42C27] via-[#FBAB1A] to-[#10984F] bg-clip-text text-transparent">Y.O.U</span>
      </h2>

      {/* Grid 3 cols × 2 rows */}
      <div className="grid grid-cols-3 gap-6">
        {MEMBERS.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </section>
  );
}
