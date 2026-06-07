import { Image } from 'antd';
import { Icon } from '@/components/ui/Icon';
import { ViewAllButton } from '@/components/common/ViewAllButton';
import { ROUTES } from '@/routes/paths';
import { EXECUTIVE_LEADERSHIP, TEAM_DATA } from '@/data';

// Single source of truth (see src/data/team.ts) — shared with the /leadership page.
const LEADERS = EXECUTIVE_LEADERSHIP;
const DIRECTORS = TEAM_DATA;

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
            <div className="w-[240px] h-[240px] rounded-full overflow-hidden border-4 border-neutral-200 mb-4 relative group cursor-pointer">
              <Image src={leader.avatarUrl} alt={leader.name} preview={false} className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-50" style={{ width: '100%', height: '100%', objectFit: 'cover' }} wrapperStyle={{ width: '100%', height: '100%' }} />
              <div className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex gap-3">
                  <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
                    <Icon name="jam:facebook" size={16} className="text-[#1877F2]" />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
                    <Icon name="jam:linkedin" size={16} className="text-[#0A66C2]" />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
                    <Icon name="ic:baseline-tiktok" size={16} className="text-[#111111]" />
                  </a>
                </div>
              </div>
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
            <div className="w-[180px] h-[180px] rounded-full overflow-hidden border-4 border-neutral-200 mb-3 relative group cursor-pointer">
              <Image src={dir.avatarUrl} alt={dir.name} preview={false} className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-50" style={{ width: '100%', height: '100%', objectFit: 'cover' }} wrapperStyle={{ width: '100%', height: '100%' }} />
              <div className="absolute inset-0 flex items-end justify-center pb-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex gap-2">
                  <a href="#" className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
                    <Icon name="jam:facebook" size={14} className="text-[#1877F2]" />
                  </a>
                  <a href="#" className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
                    <Icon name="jam:linkedin" size={14} className="text-[#0A66C2]" />
                  </a>
                  <a href="#" className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
                    <Icon name="ic:baseline-tiktok" size={14} className="text-[#111111]" />
                  </a>
                </div>
              </div>
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
        <ViewAllButton to={ROUTES.LEADERSHIP} />
      </div>
    </section>
  );
}
