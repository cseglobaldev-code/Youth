import { Image } from 'antd';
import { Icon } from '@/components/ui/Icon';
import { SDGTag } from '@/components/ui/SDGTag';

export interface MemberCardLargeProps {
  member: {
    id: string;
    name: string;
    country: string;
    period: string;
    leader: string;
    focusSdgs: number[];
    coverUrl: string;
    logoUrl: string;
  };
  onClick?: () => void;
  className?: string;
}

export function MemberCardLarge({
  member,
  onClick,
  className,
}: MemberCardLargeProps) {
  return (
    <div
      className={`w-[426.67px] h-[456.68px] bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col cursor-pointer transition-shadow duration-200 hover:shadow-xl ${className || ''}`}
      onClick={onClick}
    >
      {/* Cover */}
      <div className="relative w-[426.67px] h-[214.68px] flex-shrink-0">
        <Image
          src={member.coverUrl}
          alt={member.name}
          preview={false}
          className="w-full h-full object-cover"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          wrapperStyle={{ width: '100%', height: '100%' }}
        />
        {/* Logo circle */}
        <div className="absolute bottom-[-40px] left-4 w-[80px] h-[80px] rounded-full border-4 border-white overflow-hidden bg-white shadow">
          <Image
            src={member.logoUrl}
            alt={`${member.name} logo`}
            preview={false}
            className="w-full h-full object-cover"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            wrapperStyle={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-10 px-4 pb-4 flex flex-col">
        {/* Title */}
        <h3
          className="font-semibold text-[24px] text-[#111111]"
          style={{ fontFamily: 'Open Sans, sans-serif' }}
        >
          {member.name}
        </h3>

        {/* Info items */}
        <div className="mt-3 space-y-1.5">
          <div
            className="flex items-center gap-4 text-[18px] font-medium text-neutral-600"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            <span className="flex items-center gap-1">
              <Icon name="mynaui:map-pin" size={18} />
              {member.country}
            </span>
            <span className="flex items-center gap-1">
              <Icon name="iconoir:clock" size={18} />
              {member.period}
            </span>
          </div>
          <div
            className="flex items-center gap-1 text-[18px] font-medium text-neutral-600"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            <Icon name="solar:user-linear" size={18} />
            {member.leader}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto pt-3">
          {member.focusSdgs.map((sdgId) => (
            <SDGTag key={sdgId} sdgId={sdgId} size="md" />
          ))}
        </div>
      </div>
    </div>
  );
}
