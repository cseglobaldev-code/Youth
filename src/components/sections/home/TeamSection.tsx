const LEADERS = [
  { id: 'leader-1', name: 'Minh Anh Nguyen', role: 'President & Chair', imageUrl: '/leadershi1p.png' },
  { id: 'leader-2', name: 'Safeen H. Mohammed', role: 'Vice President', imageUrl: '/leadership2.png' },
  { id: 'leader-3', name: 'Muhammad Younas', role: 'Secretary General', imageUrl: '/leadership3.png' },
];

const DIRECTORS = [
  { id: 'dir-1', name: 'Sophie Martin', role: 'Continental Director', imageUrl: '/directors1.png' },
  { id: 'dir-2', name: 'Yuki Tanaka', role: 'Continental Director', imageUrl: '/directors2.png' },
  { id: 'dir-3', name: 'Sarah Johnson', role: 'Continental Director', imageUrl: '/directors3.png' },
  { id: 'dir-4', name: 'Amara Okafor', role: 'Continental Director', imageUrl: '/directors4.png' },
  { id: 'dir-5', name: 'Hans Mueller', role: 'Continental Director', imageUrl: '/directors1.png' },
];

export function TeamSection() {
  return (
    <section className="bg-white py-[120px] px-[288px]">
      {/* Header */}
      <div className="text-center mb-[60px]">
        <h2 className="font-semibold text-[48px] leading-tight" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          The People Behind{' '}
          <span className="bg-gradient-to-r from-[#E42C27] via-[#FBAB1A] to-[#10984F] bg-clip-text text-transparent">
            Y.O.U
          </span>
        </h2>
      </div>

      {/* Leaders — 3 large circles */}
      <div className="flex justify-center gap-[40px] mb-[40px]">
        {LEADERS.map((leader) => (
          <div key={leader.id} className="flex flex-col items-center">
            <div className="w-[240px] h-[240px] rounded-full overflow-hidden border-4 border-neutral-200 mb-4">
              <img src={leader.imageUrl} alt={leader.name} className="w-full h-full object-cover" />
            </div>
            <h4 className="font-semibold text-[20px] text-[#111111] text-center" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              {leader.name}
            </h4>
            <p className="text-[16px] text-neutral-500 text-center" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              {leader.role}
            </p>
          </div>
        ))}
      </div>

      {/* Divider */}
      <hr className="border-neutral-200 my-[60px]" />

      {/* Continental Directors */}
      <div className="text-center mb-[40px]">
        <h3 className="font-semibold text-[28px] text-[#111111]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          Continental Directors
        </h3>
      </div>

      <div className="flex justify-center gap-[32px] mb-[60px]">
        {DIRECTORS.map((dir) => (
          <div key={dir.id} className="flex flex-col items-center">
            <div className="w-[180px] h-[180px] rounded-full overflow-hidden border-4 border-neutral-200 mb-3">
              <img src={dir.imageUrl} alt={dir.name} className="w-full h-full object-cover" />
            </div>
            <h4 className="font-semibold text-[16px] text-[#111111] text-center" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              {dir.name}
            </h4>
            <p className="text-[14px] text-neutral-500 text-center" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              {dir.role}
            </p>
          </div>
        ))}
      </div>

      {/* View all button */}
      <div className="flex justify-center">
        <button className="px-8 py-3 border-2 border-[#EE334E] text-[#EE334E] text-[18px] font-semibold rounded-full hover:bg-[#EE334E] hover:text-white transition-colors" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          View all
        </button>
      </div>
    </section>
  );
}
